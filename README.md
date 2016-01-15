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

* You can use Vagrant in local development. The configuration is in Vagrantfile.
* To get started you will need to install vagrant and a provider (e.g. virtualbox),
then cd to this directory and run `vagrant up`. That's it. See Vagrant Getting Started guide
for more info. This directory will be mapped to /vagrant on the VM as a synced folder.

* `ember server --proxy your-admin-url` where your-admin-url points to the application
hosting the API you're using. I.e. `http://nick-admin.subtextdev.org/`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Deploying

This application uses [front_end_builds](https://github.com/tedconf/front_end_builds) to host the
static JS and CSS assets. It also uses [ember-cli-front-end-builds](https://github.com/tedconf/ember-cli-front-end-builds)
to deploy the application to S3 and notify front_end_buils when a new
version has been deployed.

### Deployment Pre-setup Requirements

1. Copy `config/deploy.example` to `config/deploy.js`
2. Setup AWS account, configured in config/deploy.js

### Deployment steps:

1. Check out the branch you want to deploy and ensure you have the
latest version.

    ```
    git checkout release-3.1.0
    git pull release-3.1.0
    ```

2. **IMPORTANT!** Ensure you don't have any uncommitted changes. When deploying, the
ember-cli-front-end-builds tool compiles whatever code changes are in your current
directory, regardless of whether they have been staged or committed.

3. Build and deploy branch to AWS and let front_end_builds know it's available:

    ```
    ember deploy --environment=production
    ```

    **Note** - this deploys to staging and QA, and does not actually deploy to production.
    Ember only has three environments: development, test, and production.
    Specifying the "production" environment with the deploy command only means that it
    uses production settings when building the assets. The front_end_builds
    server that it deploys to is defined in config/deploy.js.

    When that successfully completes, you will see output like this:

    ```
    Built project successfully. Stored in "dist/".
    Uploading assets to subtext-consumer/dist...
    Done uploading assets
    Uploading assets to subtext-consumer/dist-eaee6f8600f3b8b4da24c464f9964251952ee2da/...
    Done uploading assets
    Notifying http://stage-consumer.subtext.org/front_end_builds/builds, http://qa-consumer.subtext.org/front_end_builds/builds...

    Notifying http://stage-consumer.subtext.org/front_end_builds/builds, http://qa-consumer.subtext.org/front_end_builds/builds...
    Endpoints successfully notified.
    ```

4. Preview the build

    Visit the front_end_builds application in your browser (i.e. [http://stage-consumer.subtext.org/admin](http://stage-consumer.subtext.org/admin)) and visit the "ux2" app.
    You should see the branch that you deployed. Click "Launch" to preview
    the build.

5. Make the build live (optional)

    If the build looks good, you need to click the orange "Make Live" button so that deploy is available
    without passing the ?id= URL parameter.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

