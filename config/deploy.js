var path = require('path');
var sshkey = process.env['EMBER_SSH_KEY'] ? process.env['EMBER_SSH_KEY'] : path.join(process.env['HOME'], '.ssh/id_rsa');

// AWS keys should be set in the environment via AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
module.exports = {
  "production": {
    "assets": {
      "bucket": "subtext-consumer",
      "prefix": "dist",
      "distPrefix": "dist-{{SHA}}"
    },
    "index": {
      "app": "ux2",
      "endpoints": ["http://dailyuv.com"],
      "privateKey": sshkey
    }
  },
  "staging": {
    "assets": {
      "bucket": "subtext-consumer",
      "prefix": "dist",
      "distPrefix": "dist-{{SHA}}"
    },
    "index": {
      "app": "ux2",
      "endpoints": ["http://stage-consumer.subtext.org"],
      "privateKey": sshkey
    }
  },
  "qa": {
      "assets": {
      "bucket": "subtext-consumer",
      "prefix": "dist",
      "distPrefix": "dist-{{SHA}}"
    },
    "index": {
      "app": "ux2",
      "endpoints": ["http://qa-consumer.subtext.org"],
      "privateKey": sshkey
    }
  }
};
