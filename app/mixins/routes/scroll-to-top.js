import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    didTransition: function() {
      window.scrollTo(0, 0);
      return true; // Bubble the didTransition event
    }
  }
});
