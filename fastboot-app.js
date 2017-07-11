require('newrelic');
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

let server = new FastBootAppServer({
  beforeMiddleware: function (app) { app.use('/healthcheck', require('express-healthcheck')()); },
  distPath: 'dist',
  gzip: false,
  workerCount: process.env.EXPRESS_WORKER_COUNT || 1
});

server.start();
