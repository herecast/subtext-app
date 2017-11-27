import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['selectedDigests', 'email'],
  selectedDigest: null,

  secondaryBackground: true,

  actions: {
    wasAuthenticated() {
      this.send('transitionAfterAuthentication');
    }
  }
});
