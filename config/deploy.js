module.exports = {
  "production": {
    "assets": {
      // TODO: Move to a production S3 bucket and user and replace these
      // values with something that is not hardcoded. These are for my (Pete)
      // personal AWS account and a user that I setup specifically for dev.
      "accessKeyId": "AKIAIRKB5T43VHJDWIXA",
      "secretAccessKey": "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",
      "bucket": "subtext-test-deploys",
      "prefix": "dist",
      "distPrefix": "dist-{{SHA}}"
    },
    "index": {
      "app": "events",
      "endpoints": [
        "http://qa-demo.subtext.org"
        // "http://localhost:3000" // Uncomment for local dev testing
      ]
    }
  }
};
