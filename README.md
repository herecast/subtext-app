# Subtext-ui

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

This application uses a unique deployment process which mounts the Ember
application within a Rails application. On the Rails side, we're using
TED's [front_end_builds](https://github.com/tedconf/front_end_builds)
Ruby gem and mounting the app at /events. On the ember side, we're using
the corresponding [ember-cli-front-end-builds](https://github.com/tedconf/ember-cli-front-end-builds)
Ember addon for deployment.

####Deployment Requirements

* AWS account, configured in config/deploy.js (copied from example file)
* SSH public key setup in the Rails application's Ember admin config

####How Deployment Works

Deployment is done using the following command:

```
ember deploy --environment=production
```

When that runs, the following happens:

1. Settings are read from config/deploy.js
1. Project is built and stored in "dist/".
1. Compiled application is uploaded to S3 bucket
1. Rails application is notified of new builds
1. Rails application automatically makes newest build live (optional,
   configured in Rails app)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

