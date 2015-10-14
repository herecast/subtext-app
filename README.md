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

### Deploying

This application uses [Navis](http://navis.io/) to deploy and view the
static JS and CSS assets.

####Deployment Requirements

* AWS account, configured in config/deploy.js (copied from example file)
* Navis account, configured in config/deploy.js (copied from example file)

####Deployment steps:

1) Make sure you're deploying master and have the latest version:

```
git checkout master
git pull master
```

2) Build and deploy master to AWS and let Navis know it's available:

```
ember deploy --environment=production
```

If that successfully completes, you will see output like this:

```
Built project successfully. Stored in "tmp/deploy-dist/".
Uploading assets...
Uploading: index.html
Assets upload successful. Done uploading.

Uploading `tmp/deploy-dist/index.html`...

Index file was successfully uploaded

Upload successful!

Uploaded revision: subtext-ui:53899a6
```

Note the uploaded revision above (subtext-ui:53899a6), yours will be different.

3) Preview the build

Visit this URL in your browser (replacing the build SHA with yours):

```
http://subtext-staging.navis.io/?build=subtext-ui:53899a6
```

4) Activate the build

If the build looks good, you need to activate it so it's available
without passing the ?build= URL parameter.

Replace this build number with the build you just deployed.

```
ember deploy:activate --environment=production --revision=subtext-ui:53899a6
```

5) View your build

Visit this URL in your browser

```
http://subtext-staging.navis.io/
```

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

