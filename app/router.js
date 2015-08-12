import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', {path: '/'}, function() {

  });

  this.route('login', {path: '/users/sign_in'});
  this.route('register', {path: '/users/sign_up'});

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

});

export default Router;
