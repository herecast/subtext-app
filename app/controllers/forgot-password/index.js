import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['returnUrl'],
  returnUrl: null,
  secondaryBackground: true,

  actions: {
    goToNext() {
      this.transitionToRoute('forgot-password.check-email');
    }
  }
});
