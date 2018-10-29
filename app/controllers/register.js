import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['selectedDigests', 'email'],
  selectedDigest: null,

  secondaryBackground: true,

  actions: {
    wasAuthenticated() {
      this.send('transitionAfterAuthentication');
    }
  }
});
