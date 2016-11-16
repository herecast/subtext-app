import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['selectedDigests', 'email'],
  selectedDigest: null,

  secondaryBackground: true,

  actions: {
    afterRegister() {
      this.transitionToRoute('register.complete');
    }
  }
});
