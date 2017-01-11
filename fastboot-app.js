require('newrelic');
const FastBootAppServer = require('fastboot-app-server');

function httpCacheHeaders(req, res, next) {
  res.set('Cache-Control', ' public, max-age=60');
  next();
}

let server = new FastBootAppServer({
  distPath: 'dist',
  gzip: false,
  workerCount: process.env.EXPRESS_WORKER_COUNT || 1,
  beforeMiddleware: function(app) {
    app.use(httpCacheHeaders);
  }
});

server.start();
