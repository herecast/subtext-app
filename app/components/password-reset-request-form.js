import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
  tagName: 'form',
  showConfirmation: false,

  actions: {
    submit() {
      const api = get(this, 'api');
      const email = get(this, 'email');

      api.requestPasswordReset(email).then(() => {
        this.set('showConfirmation', true);
      });
    }
  }
});
