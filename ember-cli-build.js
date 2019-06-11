'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';
const hasCDN = typeof process.env.CDN_URL !== undefined && isProduction;

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'fingerprint': {
      penabled: hasCDN,
      prepend: process.env.CDN_URL,

      // SVG images are not fingerprinted by default so we have to specify
      // them along with the others that are in the default list.
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'woff2']
    },
    lessOptions: {
      paths: [
        'bower_components/bootstrap/less'
      ]
    },
    'ember-cli-pickadate': {
      theme: 'classic'
    },
    'ember-test-selectors': {
      strip: false //switch to true for release
    },
    sourcemaps: {
      enabled: true
    }
  });

  //Intersection observer
  app.import('vendor/intersection-observer.js', {using: [{transformation: 'fastbootShim'}]});


  // provides String.endsWith String.includes etc.. for PhantomJS, and older browsers
  app.import('bower_components/es6-shim/es6-shim.js');

  // BIG CONTRIBUTORS TO VENDOR FILE SIZE
  if (app.env !== 'production') {
    app.import('bower_components/Faker/build/build/faker.js'); // contributes 207kb gzipped file size
  }


  app.import('bower_components/bootstrap/js/affix.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/bootstrap/js/collapse.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/bootstrap/js/dropdown.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/bootstrap/js/tooltip.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/bootstrap/js/modal.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/PACE/pace.js', {using: [{transformation: 'fastbootShim'}]});

  app.import('bower_components/summernote/dist/summernote.css');

  app.import('bower_components/summernote/dist/summernote.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('vendor/summernote-handle.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/summernote-image-attributes/summernote-image-attributes.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/jquery-mask-plugin/src/jquery.mask.js', {using: [{transformation: 'fastbootShim'}]});

  app.import('bower_components/cropper/dist/cropper.css');

  app.import('bower_components/fullcalendar/dist/fullcalendar.css');

  app.import('bower_components/cropper/dist/cropper.js', {using: [{transformation: 'fastbootShim'}]});

  app.import('bower_components/blueimp-load-image/js/load-image.all.min.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js', {using: [{transformation: 'fastbootShim'}]});

  app.import('bower_components/fullcalendar/dist/fullcalendar.js', {using: [{transformation: 'fastbootShim'}]});

  app.import('bower_components/pickadate/lib/picker.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/pickadate/lib/picker.date.js', {using: [{transformation: 'fastbootShim'}]});
  app.import('bower_components/pickadate/lib/picker.time.js', {using: [{transformation: 'fastbootShim'}]});


  app.import('bower_components/moment/moment.js');
  app.import('bower_components/moment-recur/moment-recur.js');

  app.import('bower_components/Chart.js/Chart.js');

  app.import('bower_components/lodash/lodash.js');

  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', { destDir: 'fonts' });
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', { destDir: 'fonts' });

  app.import('bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
  app.import('bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js', {using: [{transformation: 'fastbootShim'}]});


  return app.toTree();
};
