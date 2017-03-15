import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', {path: '/'}, function() {
    this.route('show', {path: ':id'});
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

    this.route('all', {path: '/'}, function() {
      this.route('show', {path: ':id'});
    });

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

  this.route('forgot-password', function() {
    this.route('edit', {path: ':reset_token'});
    this.route('check-email');
  });

  this.route('market', function() {
    this.route('all', {path: '/'}, function() {
      this.route('show', {path: '/:id'});
    });
    this.route('category-landing', {path: '/category/:cat_id'}, function() {
      this.route('show', {path: '/:id'});
    });
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
    this.route('all', {path: '/'}, function() {
      this.route('show', {path: '/:id'});
    });
    this.route('new');
    this.route('edit', {path: '/:id/edit'});
  });

  this.route('talk', function() {
    this.route('all', {path: '/'}, function() {
      this.route('show', {path: '/:id'});
    });
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
    this.route('show', {path: ':id'});
  });

  this.route('terms');
  this.route('privacy');
  this.route('copyright');
  this.route('copyright-agent');

  this.route('organization-profile', {path: '/organizations/:slug'}, function() {
    this.route('edit');
    this.route('news-item', {path: ':id'});
  });

  this.route('digests', function() {
    this.route('subscribe', {path: '/:id/subscribe'});
  });

  this.route('lists', function() {
    this.route('example-preview');
    this.route('subscribe', {path: '/:id/subscribe'});
    this.route('unsubscribe', {path: '/:listserv_id/unsubscribe'});
    this.route('manage', {path: '/:id/manage'});
    this.route('posts', {path: '/posts/:id'}, function() {
      this.route('edit');
      this.route('review');
      this.route('confirmed');
    });
    this.route('confirm_post', {path: '/confirm_post/:id'});
  });
  this.route('prohibited-items');

  this.route('account', function() {
    this.route('community');
    this.route('subscriptions');
  });
  this.route('kitchen-sink');

  this.route('promotions.show', {path: '/promotions/:id'});

  // error-404 page is used for intermediateTransitionTo when a model returns 404
  // error-404-passthrough is used as a catch-all route to render a 404 page when a non-existent route is requested
  // Unfortunately, the catch-all route was not working nicely with intermediateTransitionTo, so both are necessary
  this.route('error-404');
  this.route('error-404-passthrough', {path: "*path"});
});

export default Router;
