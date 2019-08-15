require('newrelic');
const express = require('express');
const fetch = require('node-fetch');

const cookieParser = require('cookie-parser');

var url = require('url');

const FastBootAppServer = require('fastboot-app-server');
const cluster = require('cluster');

const enforceHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https'){
    return next();
  } else {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
};

if ( process.env.SEND_CLOUDWATCH_METRICS && cluster.isWorker ) {
  const cloudwatchMetrics = require('cloudwatch-metrics');
  const performance = require('performance-nodejs');
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

  performance(data => {
    millisecondsMetric.put(data['lag'], 'eventLoopLag');
    bytesMetric.put(data['heap']['total_heap_size'], 'heapTotal');
    bytesMetric.put(data['heap']['used_heap_size'], 'heapUsed');
    bytesMetric.put(process.memoryUsage()['rss'], 'rss');
    percentMetric.put(data['cpuUsage']['usedPercent'], 'cpuUsedPercent');
  }, 'B', 20000);
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

async function tryRewrite(path, req) {
  const api_base = process.env.API_BASE_URL || (req.protocol + req.hostname);
  const rawRewrite = await fetch(api_base + "/api/v3/rewrites?query=" + path);
  const rewrite = await rawRewrite.json();
  return rewrite;
};

function rewritesMiddleware(req, res, next) {
  const path = req.path.substring(1);
  const pathIsContentShow = path.indexOf('/') < 0;
  const pathIsNotID = isNaN(path)

  if(pathIsContentShow && pathIsNotID) {
    tryRewrite(path, req).then(json => {
      if (json['rewrite']) {
        if (json['rewrite']['destination'].indexOf('http') === 0) {
          return res.redirect(307, `${json['rewrite']['destination']}`);
        } else {
          return res.redirect(307, `${req.protocol}://${req.hostname}/${json['rewrite']['destination']}`);
        }
      } else {
        return next();
      }
    });
  } else {
    return next();
  }
};

let server = new FastBootAppServer({
  beforeMiddleware: function (app) {
    app.use('/healthcheck', require('express-healthcheck')());
    app.set('trust proxy', true);

    // force SSL
    app.use((req, res, next) => {
       return enforceHTTPS(req, res, next);
    });

    // serve files out of public folder
    app.use(express.static('public'));

    app.use(cookieParser());

    app.use(sitemapMiddleware);

    app.use(rewritesMiddleware);
  },
  distPath: 'dist',
  gzip: true,
  workerCount: process.env.EXPRESS_WORKER_COUNT || 1
});

server.start();
