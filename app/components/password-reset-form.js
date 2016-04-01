import Ember from 'ember';

const { get, inject } = Ember;

const { computed } = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
  tagName: 'form',
  showErrors: false,
  showConfirmation: false,
  password: '',
  passwordConfirmation: '',
  serverErrors: [],

  passwordsMatch: computed('password', 'passwordConfirmation', function() {
    return (this.get('password').length && this.get('password') === this.get('passwordConfirmation'));
  }),

  actions: {
    submit() {
      if (this.get('passwordsMatch')) {
        this.set('showError', false);
        const api = get(this, 'api');

        api.resetPassword({
          user: {
            reset_password_token: this.get('token'),
            password: this.get('password'),
            password_confirmation: this.get('passwordConfirmation')
          }
        }).then(() => {
          this.set('showConfirmation', true);
        }, (response) => {
          this.set('serverErrors', response.jqXHR.responseJSON.errors);
          this.set('showErrors', true);
        });
      } else {
        this.set('showErrors', true);
      }
    }
  }
});
