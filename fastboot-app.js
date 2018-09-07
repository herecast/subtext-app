require('newrelic');
const express = require('express');
const fetch = require('node-fetch');

const cookieParser = require('cookie-parser');

var url = require('url');

const FastBootAppServer = require('fastboot-app-server');
const cluster = require('cluster');

if ( process.env.SEND_CLOUDWATCH_METRICS && cluster.isWorker ) {
  const cloudwatchMetrics = require('cloudwatch-metrics');
  const performance = require('performance-nodejs');
  const gc = (require('gc-stats'))();
  const cloudwatch_namespace = process.env.CLOUDWATCH_NAMESPACE || 'Nodejs';
  const stack_name = process.env.STACK_NAME || 'unknown';

  cloudwatchMetrics.initialize({
    region: 'us-east-1'
  });

  const bytesMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'Bytes', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  const percentMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'Percent', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  const millisecondsMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'Milliseconds', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  const gcTypeMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'None', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  const gcPauseMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'Milliseconds', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  const gcBytesMetric = new cloudwatchMetrics.Metric(cloudwatch_namespace, 'Bytes', [{
    Name: 'stackName',
    Value: stack_name
  }]);

  gc.on('stats', function (stats) {
    gcPauseMetric.put(stats['pauseMS'], 'gcPauseMS');
    // 1: Scavenge (minor GC)
    // 2: Mark/Sweep/Compact (major GC)
    // 4: Incremental marking
    // 8: Weak/Phantom callback processing
    // 15: All
    gcTypeMetric.put(stats['gctype'], 'gcType');
    gcBytesMetric.put(Math.abs(stats['diff']['usedHeapSize']), 'usedHeapSizeFreed');
  });

  performance(data => {
    millisecondsMetric.put(data['lag'], 'eventLoopLag');
    bytesMetric.put(data['heap']['total_heap_size'], 'heapTotal');
    bytesMetric.put(data['heap']['used_heap_size'], 'heapUsed');
    bytesMetric.put(process.memoryUsage()['rss'], 'rss');
    percentMetric.put(data['cpuUsage']['usedPercent'], 'cpuUsedPercent');
  }, 'B', 20000);
}

const cookieLocationRedirect = function(req, res, next) {
  if(req.path === '/' || /^\/feed\/?$/.test(req.path)) {
    if(req.query['location'] && req.query['location'].length > 0) {
      next();
    } else {
      // Location not included in url
      const locationId = req.cookies['locationId'];
      const locationConfirmed = req.cookies['locationConfirmed'];
      let redirParams;

      if(locationId && locationConfirmed === 'true') {
        redirParams = url.format({
          pathname: '/feed',
          query: Object.assign({}, req.query, {
            location: locationId
          })
        });
      } else {
        redirParams = url.format({
          pathname: '/feed',
          query: Object.assign({}, req.query, {
            location: 'sharon-vt'
          })
        });
      }

      res.setHeader('Cache-Control', 'max-age=3600');
      res.redirect(redirParams);
    }
  } else {
    next();
  }
};

const removeFeedQueryParamsForDirect = function(req, res, next) {
  /**
   * Filter query params for direct feed detail urls
   *
   * Currently location, radius, query, and type should be removed
   */
  if(req.path.indexOf('/feed/') == 0) {
    var filterOut = ['location','radius','query','type'];

    var redirectNecessary = filterOut.some(function(param) {
      return param in req.query;
    });

    if(redirectNecessary) {
      var newQueryParams = {};

      for(var param in req.query) {
        if(!filterOut.includes(param)) {
          newQueryParams[param] = req.query[param];
        }
      }

      res.setHeader('Cache-Control', 'max-age=3600');

      res.redirect(url.format({
        pathname: req.path,
        query: newQueryParams
      }));
    } else {
      next();
    }
  } else {
    next();
  }
};

const legacyRedirect = function(req, res, next) {
  /*
   * Redirects to redirect from legacy paths and query params to current ones
   */
  if (req.path.indexOf('/feed') == 0) {
    var typeRedirects = {
      "news" : "posts",
      "event": "calendar"
    };
    var redirectNecessary = ('type' in req.query) && Object.keys(typeRedirects).some(function(param) {
      return param == req.query.type;
    });

    if (redirectNecessary) {
      req.query.type = typeRedirects[req.query.type];

      res.setHeader('Cache-Control', 'max-age=3600');

      res.redirect(url.format({
        pathname: req.path,
        query: req.query
      }));
    } else {
      next();
    }
  } else {
    next();
  }
}

function sitemapMiddleware(req, res, next) {
  const api_base = process.env.API_BASE_URL || (req.protocol + req.hostname);
  const consumer_base = `${req.protocol}://${req.hostname}`;

  const sitemaps = {
    '/sitemap-contents.txt' : function() {

      return fetch(api_base + "/api/v3/contents/sitemap_ids?type=news,market,talk").then(response => {
        return response.json().then(json => {
          let output = "";
          json['content_ids'].forEach(id => {
            output = output + `${consumer_base}/feed/${id}\n`;
          });
          return output;
        });
      });
    },
    '/sitemap-profiles.txt' : function() {

      return fetch(api_base + "/api/v3/organizations/sitemap_ids").then(response => {
        return response.json().then(json => {
          let output = "";
          json['organization_ids'].forEach(id => {
            output = output + `${consumer_base}/profile/${id}\n`;
          });
          return output;
        });
      });
    },
    '/sitemap-events.txt' : function() {

      return fetch(api_base + "/api/v3/event_instances/sitemap_ids").then(response => {
        return response.json().then(json => {
          let output = "";
          json['instances'].forEach(record => {
            output = output + `${consumer_base}/feed/${record.content_id}/${record.id}\n`;
          });
          return output;
        });
      });
    }
  };

  if(Object.keys(sitemaps).includes(req.path)) {
    sitemaps[ req.path ]().then(output => {
      res.set({'Cache-Control' : 'public, max-age=86400'});
      res.status(200).type('text/plain').send(output);
    }).catch(error => {
      console.error(error);
      res.status(500).type('text/plain').send("ERROR: Check the logs for the error message.");
    });
  } else {
    return next();
  }
}

let server = new FastBootAppServer({
  beforeMiddleware: function (app) {
    app.use('/healthcheck', require('express-healthcheck')());
    app.set('trust proxy', true);

    // serve files out of public folder
    app.use(express.static('public'));

    app.use(cookieParser());

    app.use(sitemapMiddleware);

    app.use(legacyRedirect);

    app.use(cookieLocationRedirect);

    app.use(removeFeedQueryParamsForDirect);
  },
  distPath: 'dist',
  gzip: false,
  workerCount: process.env.EXPRESS_WORKER_COUNT || 1
});

server.start();
