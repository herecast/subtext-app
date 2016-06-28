var app = 'ux2';
var qaHost = 'https://qa-consumer.subtext.org';
var stagingHost = 'https://stage-consumer.subtext.org';
var productionHost = 'https://dailyuv.com';
var path = require('path');
var sshkey = process.env['EMBER_SSH_KEY'] ? process.env['EMBER_SSH_KEY'] : path.join(process.env['HOME'], '.ssh/id_rsa');


module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'subtext-consumer',
      region: 'us-east-1',
      prefix: 'dist',
    },
    'front-end-builds': {
      app: app,
      privateKey: sshkey
    }
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    ENV['front-end-builds'].endpoint = 'http://localhost:3000';
  }

  if (deployTarget === 'qa') {
    ENV.build.environment = 'production';
    ENV['front-end-builds'].endpoint = qaHost;
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    ENV['front-end-builds'].endpoint = stagingHost;
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['front-end-builds'].endpoint = productionHost;
  }

  if (deployTarget == 'fe') {
    ENV.build.environment = 'production';
    ENV['front-end-builds'].endpoint = process.env['FE_ENDPOINT'];
  }

  return ENV;
};
