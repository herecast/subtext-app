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

  ENV['ember-toastr'] = {
    toastrOptions: {
      progressBar: false
    }
  };

  ENV['simple-auth-devise'] = {
    serverTokenEndpoint: '/api/v3/users/sign_in',
  };

  ENV['ember-cli-mirage'] = {
    directory: 'app/mirage'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.mixpanel = {
      enabled: true,
      LOG_EVENT_TRACKING: true,
    }

    /*
    ENV['ember-cli-mirage'] = {
      enabled: false
    }
    */
    if(process.env.FACEBOOK_API_ID) {
      ENV.fb_enabled = true;
    }

    ENV['consumer-app-uri'] = process.env.CONSUMER_APP_URI;
    ENV['gmaps-api-token'] = process.env.GMAPS_API_TOKEN;
    ENV['mixpanel-api-token'] = process.env.MIXPANEL_API_TOKEN;
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

    ENV.mixpanel = {
      enabled: false,
      LOG_EVENT_TRACKING: false,
    }

    ENV['mixpanel-api-token'] = '';

    ENV['simple-auth'] = {
      store: 'simple-auth-session-store:ephemeral'
    }
  }

  if (environment === 'production') {
    ENV.baseURL = '/';

    // Uncomment to enable mock API in production
    ENV['ember-cli-mirage'] = {
      enabled: false
    }

    ENV.fb_enabled = true;

    ENV.mixpanel = {
      enabled: true,
      LOG_EVENT_TRACKING: false,
    }
  }

  return ENV;
};
