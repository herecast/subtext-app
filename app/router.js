import Ember from 'ember';
import config from './config/environment';
/* global dataLayer */

const {
  get,
  run
} = Ember;

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.reopen({
  notifyGoogleAnalytics: function() {
    // Wrap in run.later so that the page title is available
    run.later(() => {
      if (typeof dataLayer !== "undefined") {
        return dataLayer.push({
          'event':'VirtualPageview',
          'virtualPageURL': get(this, 'url'),
          'virtualPageTitle' : document.title
        });
      }
    });
  }.on('didTransition')
});

Router.map(function() {
  this.route('index', {path: '/'}, function() {
  });

  this.route('dashboard');

  this.route('login', {path: '/sign_in'});
  this.route('register', {path: '/sign_up'});
  this.route('register.complete', {path: '/sign_up/complete'});
  this.route('register.reconfirm',{path: '/sign_up/reconfirm'});
  this.route('register.confirm', {path: '/sign_up/confirm/:token'});
  this.route('register.error', {path: '/sign_up/error'});

  this.route('content-metrics.show', {path: '/metrics/content/:content_id'});
  this.route('ad-metrics.show', {path: '/metrics/ad/:content_id'});

  this.route('events', {path: '/events'}, function() {
    this.route('all', {path: '/'}, function() {});

    this.route('show', {path: '/:id'});

    this.route('new', {path: '/new'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });

    this.route('edit', {path: '/:id/edit'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });
  });

  this.resource('forgot-password', function() {
    this.route('edit', {path: ':reset_token'});
  });

  this.route('market', function() {
    this.route('all', {path: '/'}, function() {});
    this.route('show', {path: '/:id'});
    this.route('new', {path: '/new'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });
    this.route('edit', {path: '/:id/edit'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });
  });

  this.route('news', function() {
    this.route('all', {path: '/'}, function() {});
    this.route('show', {path: '/:id'});
  });

  this.route('talk', function() {
    this.route('all', {path: '/'}, function() {});
    this.route('show', {path: '/:id'});
    this.route('new', {path: '/new'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });
    this.route('edit', {path: '/:id/edit'}, function() {
      this.route('details');
      this.route('promotion');
      this.route('preview');
    });
  });

  this.route('directory', function() {
    this.route('landing', {path: '/'}, function() {});
    this.route('search', {path: '/s'}, function() {
      this.route('results', {path: '/'}, function() {});
      this.route('show', {path: '/:id'});
    });
  });

  this.route('terms');
  this.route('privacy');
  this.route('copyright');
  this.route('copyright-agent');
  this.route('error-404', {path: '/not-found'});
});

export default Router;
