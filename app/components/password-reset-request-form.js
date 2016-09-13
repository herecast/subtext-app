import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
  tagName: 'form',
  showConfirmation: false,
  returnUrl: null,

  actions: {
    submit() {
      const api = get(this, 'api');
      const email = get(this, 'email');
      const returnUrl = get(this, 'returnUrl');

      api.requestPasswordReset(email, returnUrl).then(() => {
        this.set('showConfirmation', true);
      });
    }
  }
});
