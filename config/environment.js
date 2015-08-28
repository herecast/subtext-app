/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'subtext-ui',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    API_NAMESPACE: 'api/v3',
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
    serverTokenEndpoint: '/users/sign_in',
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
      token: 'cc9e3b32dc7554b8450156bb812f70cc'
    }

    ENV.intercom = {
      id: 'egk6dwbj'
    }

    ENV['ember-cli-mirage'] = {
      enabled: true
    }

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
      token: ''
    }
  }

  if (environment === 'production') {
    // Uncomment to enable mock API in production
    ENV['ember-cli-mirage'] = {
      enabled: false
    }

    ENV.mixpanel = {
      enabled: true,
      LOG_EVENT_TRACKING: false,
      // token: '3e39bf4d0cb67ca4288bae2ec4ac5bb9' // production
      token: 'cc9e3b32dc7554b8450156bb812f70cc' // development
    }

    ENV.intercom = {
      // id: 't4i5jg89' // production
      id: 'egk6dwbj' // development
    }
  }

  return ENV;
};
