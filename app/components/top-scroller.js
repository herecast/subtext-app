import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['TopScroller'],

  click: function() {
    Ember.$(window).scrollTop(0);
  }
});
