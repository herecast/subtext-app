/* jshint node: true */
var hasApiHost = (process.env.API_HOST && process.env.API_HOST.trim().length > 0);
var apiHost = (hasApiHost ? process.env.API_HOST : "");

module.exports = function(environment) {

  var ENV = {
    modulePrefix: 'subtext-ui',
    environment: environment,
    rootURL: '/',
    podModulePrefix: 'subtext-ui/pods',
    locationType: 'auto',
    API_NAMESPACE: 'api/v3',
    API_HOST: apiHost,
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
      hostWhitelist: [/^localhost:\d+$/, /.*\.subtext\.org$/, /.*\.subtext\.org:\d+$/, apiHost]
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

  ENV['consumer-app-uri'] = process.env.CONSUMER_APP_URI || 'http://localhost:4200';
  ENV['gmaps-api-token'] = process.env.GMAPS_API_TOKEN || 'AIzaSyDYtqerJfN8Vkc5J7rhkz0Ze1szkCjw7XY';
  ENV['intercom-api-token'] = process.env.INTERCOM_API_TOKEN;
  ENV['facebook-app-id'] = process.env.FACEBOOK_API_ID;
  ENV['prerender-io-token'] = process.env.PRERENDER_IO_TOKEN;
  ENV['gtm-api-token'] = process.env.GTM_API_TOKEN;
  ENV['gtm-auth'] = process.env.GTM_AUTH;
  ENV['gtm-preview'] = process.env.GTM_PREVIEW;

  if (environment === 'development') {
     ENV.APP.LOG_RESOLVER = false;
     ENV.APP.LOG_ACTIVE_GENERATION = false;
     ENV.APP.LOG_TRANSITIONS = false;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
     ENV.APP.LOG_VIEW_LOOKUPS = false;

    if(hasApiHost) {
      ENV['ember-cli-mirage']['enabled'] = false;
    }

    if(process.env.FACEBOOK_API_ID) {
      ENV.fb_enabled = false;
    }

  }

  if (environment === 'test') {
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

    ENV.prerender_enabled = true;
  }

  return ENV;
};
