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
      'OPTIMIZED_IMAGE_URI',
      'GTM_PREVIEW',
      'OPTIMIZED_IMAGE_QUALITY',
      'ENABLE_IMAGE_OPTIMIZATION',
      'LOG_TRACKING_EVENTS',
      'STACK_NAME',
      'NEW_RELIC_BROWSER_APP_ID',
      'NEW_RELIC_BROWSER_LICENSE_KEY',
    ],
    API_NAMESPACE: 'api/v3',
    API_BASE_URL: "",
    //DEFAULT_HTTP_CACHE: " public, max-age=60",
    LOG_TRACKING_EVENTS: false,
    locationRedirectRoutes: [
      'index',
      'news',
      'events',
      'market',
      'talk'
    ],
    contentIndexRoutes: [
      'location.index',
      'location.news',
      'location.events',
      'location.market',
      'location.talk',
      'organization-profile'
    ],
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

  ENV['FACEBOOK_APP_ID'] = process.env.FACEBOOK_APP_ID || '1170705953045574';
  //ENV['OPTIMIZED_IMAGE_URI'] = process.env.OPTIMIZED_IMAGE_URI || 'http://dev-web.subtext.org:8880';
  ENV['OPTIMIZED_IMAGE_URI'] = process.env.OPTIMIZED_IMAGE_URI || 'https://qa-consumer.subtext.org/imopt';
  ENV['OPTIMIZED_IMAGE_QUALITY'] = process.env.OPTIMIZED_IMAGE_QUALITY || 80;
  ENV['ENABLE_IMAGE_OPTIMIZATION'] = 'ENABLE_IMAGE_OPTIMIZATION' in process.env ? process.env.ENABLE_IMAGE_OPTIMIZATION : true;

  ENV['STACK_NAME'] = process.env.STACK_NAME;

  ENV['NEW_RELIC_BROWSER_APP_ID'] = process.env.NEW_RELIC_BROWSER_APP_ID;
  ENV['NEW_RELIC_BROWSER_LICENSE_KEY'] = process.env.NEW_RELIC_BROWSER_LICENSE_KEY;


  // The incoming process.env.IMOPT_ALLOWED_SOURCES list can contain hostnames, e.g. 'd3ctw1a5413a3o.cloudfront.net'
  // or URIs, e.g. 'https://d3ctw1a5413a3o.cloudfront.net'.  We want to convert each item to a simple hostname.
  let normalizeSourcesToHostnames = function(sources) {
    let hostnames = [];
    for (let i=0; i<sources.length; i+=1) {
      let src = sources[i];

      let hostname = src;
      if (/^http/i.test(src)) {
        hostname = src.replace(/^https?:\/\//, '');
      }
      hostnames.push(hostname);
    }
    return hostnames;
  }
  let imopt_sources = process.env.IMOPT_ALLOWED_SOURCES || ['d3ctw1a5413a3o.cloudfront.net', 'knotweed.s3.amazonaws.com', 'subtext-misc.s3.amazonaws.com'];
  ENV['IMOPT_ALLOWED_HOSTNAMES'] = normalizeSourcesToHostnames(imopt_sources);


  if (environment === 'development') {
     ENV.APP.LOG_RESOLVER = false;
     ENV.APP.LOG_ACTIVE_GENERATION = false;
     ENV.APP.LOG_TRANSITIONS = false;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
     ENV.APP.LOG_VIEW_LOOKUPS = false;

     ENV.LOG_TRACKING_EVENTS = true;

    // Create a mock for ga variable for code that waits/depends on it
     ENV.mockWindowGa = true;

    var hasApiHost = (process.env.API_BASE_URL && process.env.API_BASE_URL.trim().length > 0);
    if(hasApiHost) {
      ENV['ember-cli-mirage']['enabled'] = false;
      ENV['API_BASE_URL'] = process.env.API_BASE_URL;
    }

    if(process.env.FACEBOOK_APP_ID) {
      ENV.fb_enabled = false;
    }

    ENV['CONSUMER_APP_URI'] = process.env.CONSUMER_APP_URI || 'http://localhost:4200';
    ENV['GMAPS_API_TOKEN'] = 'AIzaSyBY8KLZXqpXrMbEorrQWjEuQjl7yO3sVAc';
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
    };

    ENV['ENABLE_IMAGE_OPTIMIZATION'] = false;

  }

  if (environment === 'production') {
    ENV.rootURL = '/';

    ENV['ember-cli-mirage'] = {
      enabled: false,
      excludeFilesFromBuild: true
    };

    ENV.fb_enabled = true;

    ENV.DEFAULT_HTTP_CACHE = " public, max-age=60";
  }

  return ENV;
};
