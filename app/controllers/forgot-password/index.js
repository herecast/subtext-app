import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['returnUrl'],
  returnUrl: null,
  secondaryBackground: true,

  actions: {
    goToNext() {
      this.transitionToRoute('forgot-password.check-email');
    }
  }
});
