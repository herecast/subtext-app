import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.resource('events', function() {
    this.route('show', {path: '/:id'});
  });

  this.route('events.new', {path: 'events/new'}, function() {
    this.route('details');
    this.route('promotion');
    this.route('preview');
  });

  this.route('events.edit', {path: 'events/:id/edit'}, function() {
    this.route('details');
    this.route('promotion');
    this.route('preview');
  });
});
