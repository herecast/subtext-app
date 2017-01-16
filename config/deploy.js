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
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
  }

  if (deployTarget === 'qa') {
    ENV.build.environment = 'production';
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
  }

  if (deployTarget == 'fe') {
    ENV.build.environment = 'production';
  }

  return ENV;
};
