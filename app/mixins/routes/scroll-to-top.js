import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition: function() {
      Ember.$('.ember-application > .ember-view').scrollTop(0);
      return true; // Bubble the didTransition event
    }
  }
});
