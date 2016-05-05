#!/usr/bin/env node

var request  = require('request');
var execSync = require('child_process').execSync;

var env_endpoints = {
  "production": "http://dailyuv.com",
  "staging": "http://stage-consumer.subtext.org",
  "qa": "http://qa-consumer.subtext.org",
}

if (!process.env['HTTP_USERNAME'] || !process.env['HTTP_PASSWORD']) {
  throw new Error('HTTP_USERNAME and HTTP_PASSWORD must me set to authenticate to admin')
}

var environment;
process.argv.forEach(function(val, index, arrary) {
  if (val.indexOf('--environment') == 0) {
    if (start = val.indexOf('=')) {
      environment = val.substring(start + 1);
    } else {
      environment = process.argv[index + 1];
    }
  }
});

// default to production, since that is what ember-cli will do anyways
if (!environment) {
  environment = 'production'
}

var endpoint = env_endpoints[environment]
if (typeof endpoint == 'undefined') {
  throw new Error('unkown envrionment: ' + environment)
}

var getSHA = function() {
  return execSync('git rev-parse HEAD').toString().trim();
}

var findBuildId = function(body) {
  var sha = getSHA();
  for (var index in body['builds']) {
    var build = body['builds'][index];
    if (build['sha'] == sha) {
      return build['id'];
    }
  }
  // didn't find the build
  throw new Error('Unable to locate build with sha: ' + sha)
}

var activateRequest = function(endpoint, build_id) {
  console.log("activating build: " + build_id);
  request.put({
    "url": endpoint + '/admin/api/apps/1',
    "auth": {
      "user": process.env['HTTP_USERNAME'],
      "pass": process.env['HTTP_PASSWORD']
    },
    "json": true,
    "body": {
      "name": "ux2",
      "api_key": null,
      "location": "/",
      "require_manual_activation": false,
      "live_build_id": build_id
    }
  }, function(error, response, body) {
    if (error || response.statusCode != 200) {
      throw new Error('failed to activate new build: ' + error);
    }
  });
}

var activateBuild = function(endpoint) {
  request({
    "url": endpoint + '/admin/api/apps/1',
    "auth": {
      "user": process.env['HTTP_USERNAME'],
      "pass": process.env['HTTP_PASSWORD']
    },
    "json": true
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      activateRequest(endpoint, findBuildId(body));
    } else {
      throw new Error('failed to get list of builds from front end admin');
    }
  });
};

console.log('starting deploy');
execSync('ember deploy ' + process.argv.slice(2).join(' '), {
  stdio: ['inherit', 'inherit', 'inherit']
});
// don't auto-activate prod, to prevent accidents
if (environment != 'production') {
  console.log('activating new build');
  activateBuild(endpoint);
}
