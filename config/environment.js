/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'subtext-ui',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    API_NAMESPACE: '/admin_api/v3',
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
    serverTokenEndpoint: '/admin_api/v3/users/sign_in',
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

    ENV['ember-cli-mirage'] = {
      enabled: false
    }

    ENV['consumer-app-uri'] = 'http://stage-consumer.subtext.org/beta';
    ENV['gmaps-api-token'] = 'AIzaSyBY8KLZXqpXrMbEorrQWjEuQjl7yO3sVAc';
    ENV['mixpanel-api-token'] = '68e07b0ff86c37367d928b5bfe6c7578';
    ENV['intercom-api-token'] = 'egk6dwbj';
    ENV['facebook-app-id'] = '238887832828749';
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
  }

  if (environment === 'production') {
    ENV.baseURL = '/beta';

    // Uncomment to enable mock API in production
    ENV['ember-cli-mirage'] = {
      enabled: false
    }

    ENV.mixpanel = {
      enabled: true,
      LOG_EVENT_TRACKING: false,
    }
  }

  return ENV;
};
