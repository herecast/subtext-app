module.exports = function(deployTarget) {
  var ENV = {
    build: {},
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'subtext-consumer',
      region: 'us-east-1',
      prefix: 'dist',
      // default without map
      filePattern: '**/*.{js,css,png,gif,ico,jpg,xml,txt,svg,swf,eot,ttf,woff,woff2,otf}'
    },
    gzip: {
      ignorePattern: '**/*.map'
    }
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
  }

  if (['qa', 'staging', 'production', 'fe'].includes(deployTarget)) {
    ENV.build.environment = 'production';
    if (process.env.NEW_RELIC_APP_ID && process.env.NEW_RELIC_ADMIN_KEY) {
      ENV['new-relic-sourcemap'] = {
        prefix: 'https://d1dkpt9jmqqb2i.cloudfront.net/dist',
        applicationId: process.env.NEW_RELIC_APP_ID,
        nrAdminKey: process.env.NEW_RELIC_ADMIN_KEY,
      };
    } else {
      ENV.pipeline = {
        disabled: {
          "new-relic-sourcemap": true
        }
      };
    }
  }

  return ENV;
};
