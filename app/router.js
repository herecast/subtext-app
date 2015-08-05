import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'}, function() {

  });

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
  });

  this.route('news', {path: '/news'});
  
  this.route('talk', {path: '/talk'});

});

export default Router;
