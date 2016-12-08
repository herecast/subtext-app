/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'subtext-ui',
    environment: environment,
    baseURL: '/',
    podModulePrefix: 'subtext-ui/pods',
    locationType: 'auto',
    API_NAMESPACE: '/api/v3',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  // ENV['simple-auth'] = {
  // }

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

  if (environment === 'development') {
     ENV.APP.LOG_RESOLVER = false;
     ENV.APP.LOG_ACTIVE_GENERATION = false;
     ENV.APP.LOG_TRANSITIONS = false;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
     ENV.APP.LOG_VIEW_LOOKUPS = false;

    /*
    ENV['ember-cli-mirage'] = {
      enabled: false
    }
    */
    if(process.env.FACEBOOK_API_ID) {
      ENV.fb_enabled = false;
    }

    ENV['consumer-app-uri'] = process.env.CONSUMER_APP_URI;
    ENV['gmaps-api-token'] = process.env.GMAPS_API_TOKEN;
    ENV['intercom-api-token'] = process.env.INTERCOM_API_TOKEN;
    ENV['facebook-app-id'] = process.env.FACEBOOK_API_ID;
    ENV['prerender-io-token'] = process.env.PRERENDER_IO_TOKEN;
    ENV['gtm-api-token'] = process.env.GTM_API_TOKEN;
    ENV['gtm-auth'] = process.env.GTM_AUTH;
    ENV['gtm-preview'] = process.env.GTM_PREVIEW;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV['simple-auth'] = {
      store: 'simple-auth-session-store:ephemeral'
    }
  }

  if (environment === 'production') {
    ENV.baseURL = '/';

    ENV['ember-cli-mirage'] = {
      enabled: false,
      excludeFilesFromBuild: true
    };

    ENV.fb_enabled = true;

    ENV.prerender_enabled = true;
  }

  return ENV;
};
