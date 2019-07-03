import { inject as service } from '@ember/service';
import EmberRouter from '@ember/routing/router';
import { get } from '@ember/object';
import config from 'subtext-app/config/environment';


const Router = EmberRouter.extend({
  history: service('history'),
  fastboot: service(),
  location: config.locationType,
  rootURL: config.rootURL,

  didTransition() {
    this._super(...arguments);
    if (!get(this, 'fastboot.isFastBoot')) {
      get(this, 'history').trackRouteChange(
        this.currentRouteName,
        this.currentState
      );
    }
  }
});

Router.map(function() {
  this.route('feed', {path: '/'}, function() {
    this.route('show', {path: '/:id'});
    this.route('show-instance', {path: '/:id/:event_instance_id'});
  });

  this.route('profile', {path: '/profile/:organization_id'}, function() {
    this.route('all', {path: '/'}, function() {
      this.route('show', {path: '/:id'});
      this.route('show-instance', {path: '/:id/:event_instance_id'});
    });
  });

  this.route('mystuff', function() {
    this.route('comments', function() {
      this.route('show', {path: '/:id'});
    });
    this.route('subscriptions');
    this.route('account');
    this.route('contents', {path: '/'}, function() {
      this.route('show', {path: '/:id'});
    });
    this.route('bookmarks', function() {
      this.route('show', {path: '/:id'});
      this.route('show-instance', {path: '/:id/:event_instance_id'});
    });
    this.route('hides');
  });

  this.route('login', {path: '/sign_in'});
  this.route('register', {path: '/sign_up'});
  this.route('register.complete', {path: '/sign_up/complete'});
  this.route('register.reconfirm',{path: '/sign_up/reconfirm'});
  this.route('register.confirm', {path: '/sign_up/confirm/:token'});
  this.route('register.error', {path: '/sign_up/error'});

  this.route('forgot-password', function() {
    this.route('edit', {path: ':reset_token'});
    this.route('check-email');
  });

  this.route('news', function() {
    this.route('new');
    this.route('edit', {path: '/:id/edit'});
  });

  this.route('terms');
  this.route('privacy');
  this.route('copyright');
  this.route('copyright-agent');

  this.route('digests', function() {
    this.route('subscribe', {path: '/:digest_id/subscribe'});
  });

  this.route('lists', function() {
    this.route('unsubscribe', {path: '/:digest_id/unsubscribe'});
  });

  this.route('prohibited-items');

  this.route('promotions.show', {path: '/promotions/:id'});



  // error-404 page is used for intermediateTransitionTo when a model returns 404
  // error-404-passthrough is used as a catch-all route to render a 404 page when a non-existent route is requested
  // Unfortunately, the catch-all route was not working nicely with intermediateTransitionTo, so both are necessary
  this.route('error-404');
  this.route('error-404-passthrough', {path: "*path"});

  this.route('startablog');
  this.route('publisher-agreement');
  this.route('welcome');
});

export default Router;
