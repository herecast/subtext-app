/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');


module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'fingerprint': {
      prepend: 'https://d1dkpt9jmqqb2i.cloudfront.net/dist/',

      // SVG images are not fingerprinted by default so we have to specify
      // them along with the others that are in the default list.
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg']
    },
    lessOptions: {
      paths: [
        'bower_components/bootstrap/less'
      ]
    },
    'ember-cli-selectize': {
      theme: 'bootstrap3'
    },
    'ember-cli-pickadate': {
      theme: 'classic'
    }
  });

  // BIG CONTRIBUTORS TO VENDOR FILE SIZE
  if (app.env !== 'production') {
    app.import('bower_components/Faker/build/build/faker.js'); // contributes 207kb gzipped file size
  }

  // NOT SIGNIFICANT CONTRIBUTORS TO VENDOR FILE SIZE

  // THIS GROUP CONTRIBUTES 9 KB to the gzipped size PASS
  app.import('bower_components/bootstrap/js/affix.js');
  app.import('bower_components/bootstrap/js/collapse.js');
  app.import('bower_components/bootstrap/js/dropdown.js');
  app.import('bower_components/bootstrap/js/tooltip.js');
  app.import('bower_components/bootstrap/js/modal.js');
  // END


  // THIS GROUP CONTRIBUTES 50 KB to the gzipped size PASS
  app.import('bower_components/summernote/dist/summernote.js');
  app.import('bower_components/summernote/dist/summernote.css');
  app.import('vendor/summernote-handle.js');
  app.import('bower_components/summernote-image-attributes/summernote-image-attributes.js');
  app.import('bower_components/sanitize.js/lib/sanitize.js');
  app.import('bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js');
  // END

  // THIS GROUP CONTRIBUTES 62 KB to the gzipped size PASS
  app.import('bower_components/cropper/dist/cropper.js');
  app.import('bower_components/cropper/dist/cropper.css');

  app.import('bower_components/blueimp-load-image/js/load-image.all.min.js');
  app.import('bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js');

  app.import('bower_components/later/later.js');
  app.import('bower_components/moment-recur/moment-recur.js');

  app.import('bower_components/fullcalendar/dist/fullcalendar.js');
  app.import('bower_components/fullcalendar/dist/fullcalendar.css');

  app.import('bower_components/Chart.js/Chart.js');
  // END

  app.import('bower_components/lodash/lodash.js');

  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', { destDir: 'fonts' });
  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', { destDir: 'fonts' });
  return app.toTree();
};
