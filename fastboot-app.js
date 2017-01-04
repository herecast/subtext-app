const FastBootAppServer = require('fastboot-app-server');

function httpCacheHeaders(req, res, next) {
  res.set('Cache-Control', ' public, max-age=60');
  next();
}

let server = new FastBootAppServer({
  distPath: 'dist',
  gzip: true, // Optional - Enables gzip compression.
  beforeMiddleware: function(app) {
    app.use(httpCacheHeaders);
  }
});

server.start();
