import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['TopScroller'],

  click: function() {
    Ember.$('.ember-application > .ember-view').scrollTop(0);
  }
});
