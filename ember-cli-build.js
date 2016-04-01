/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');


module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'fingerprint': {
      prepend: 'https://s3.amazonaws.com/subtext-consumer/dist/',

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

  app.import('bower_components/lodash/lodash.js');

  app.import('bower_components/bootstrap/js/affix.js');
  app.import('bower_components/bootstrap/js/collapse.js');
  app.import('bower_components/bootstrap/js/dropdown.js');
  app.import('bower_components/bootstrap/js/tooltip.js');
  app.import('bower_components/bootstrap/js/modal.js');

  app.import('bower_components/Faker/build/build/faker.js');

  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
    destDir: 'fonts'
  });

  app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
    destDir: 'fonts'
  });

  app.import('bower_components/summernote/dist/summernote.js');
  app.import('bower_components/summernote/dist/summernote.css');

  app.import('bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js');

  app.import('bower_components/cropper/dist/cropper.js');
  app.import('bower_components/cropper/dist/cropper.css');

  app.import('bower_components/blueimp-load-image/js/load-image.all.min.js');
  app.import('bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js');

  app.import('bower_components/later/later.js');
  app.import('bower_components/moment-recur/moment-recur.js');

  app.import('bower_components/fullcalendar/dist/fullcalendar.js');
  app.import('bower_components/fullcalendar/dist/fullcalendar.css');

  app.import('bower_components/Chart.js/Chart.js');

  app.import('bower_components/justgage-toorshia/raphael-2.1.4.min.js');
  app.import('bower_components/justgage-toorshia/justgage.js');

  return app.toTree();
};
