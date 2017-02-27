/* jshint node: true */

module.exports = function(environment) {

  var ENV = {
    modulePrefix: 'subtext-ui',
    environment: environment,
    rootURL: '/',
    podModulePrefix: 'subtext-ui/pods',
    locationType: 'auto',
    envOverrides: [
      'API_BASE_URL',
      'API_NAMESPACE',
      'CONSUMER_APP_URI',
      'GMAPS_API_TOKEN',
      'INTERCOM_API_TOKEN',
      'FACEBOOK_APP_ID',
      'GTM_API_TOKEN',
      'GTM_AUTH',
      'FASTBOOT_DATA_CACHE_TIMEOUT',
      'OPTIMIZED_IMAGE_URI',
      'GTM_PREVIEW'
    ],
    API_NAMESPACE: 'api/v3',
    API_BASE_URL: "",
    FASTBOOT_DATA_CACHE_TIMEOUT: 30000,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: [/^localhost:\d+$/, /.*\.subtext\.org$/, /.*\.subtext\.org:\d+$/, 'dailyuv.com', 'www.dailyuv.com']
    }
  };


  ENV['simple-auth-devise'] = {
    serverTokenEndpoint: '/api/v3/users/sign_in',
  };

  ENV['ember-cli-notifications'] = {
    autoClear: true,
    clearDuration: 5000
  };

  ENV['ember-cli-mirage'] = {
    directory: 'app/mirage'
  };

  ENV['OPTIMIZED_IMAGE_URI'] = process.env.OPTIMIZED_IMAGE_URI || 'http://dev-web.subtext.org:8880';
  ENV['OPTIMIZED_IMAGE_QUALITY'] = process.env.OPTIMIZED_IMAGE_QUALITY || 80;


  if (environment === 'development') {
     ENV.APP.LOG_RESOLVER = false;
     ENV.APP.LOG_ACTIVE_GENERATION = false;
     ENV.APP.LOG_TRANSITIONS = false;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
     ENV.APP.LOG_VIEW_LOOKUPS = false;

    var hasApiHost = (process.env.API_BASE_URL && process.env.API_BASE_URL.trim().length > 0);
    if(hasApiHost) {
      ENV['ember-cli-mirage']['enabled'] = false;
      ENV['API_BASE_URL'] = process.env.API_BASE_URL;
    }

    if(process.env.FACEBOOK_APP_ID) {
      ENV.fb_enabled = false;
    }

    ENV['CONSUMER_APP_URI'] = process.env.CONSUMER_APP_URI || 'http://localhost:4200';
    ENV['GMAPS_API_TOKEN'] = 'AIzaSyDYtqerJfN8Vkc5J7rhkz0Ze1szkCjw7XY';
    ENV['INTERCOM_API_TOKEN'] = process.env.INTERCOM_API_TOKEN;
    ENV['FACEBOOK_APP_ID'] = process.env.FACEBOOK_APP_ID;
    ENV['GTM_API_TOKEN'] = process.env.GTM_API_TOKEN;
    ENV['GTM_AUTH'] = process.env.GTM_AUTH;
    ENV['GTM_PREVIEW'] = process.env.GTM_PREVIEW;

  }

  if (environment === 'test') {
    ENV.FASTBOOT_DATA_CACHE_TIMEOUT = 0;
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['ember-cli-mirage']['enabled'] = true;

    ENV['simple-auth'] = {
      store: 'simple-auth-session-store:ephemeral'
    }
  }

  if (environment === 'production') {
    ENV.rootURL = '/';

    ENV['ember-cli-mirage'] = {
      enabled: false,
      excludeFilesFromBuild: true
    };

    ENV.fb_enabled = true;
  }

  return ENV;
};
