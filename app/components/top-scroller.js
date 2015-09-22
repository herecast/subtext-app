import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['TopScroller'],

  click: function() {
    window.scrollTo(0,0);
  }
});
