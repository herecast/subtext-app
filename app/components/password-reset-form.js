import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: 'form',
  showErrors: false,
  showConfirmation: false,
  password: '',
  passwordConfirmation: '',
  serverErrors: [],

  passwordsMatch: function() {
    return (this.get('password').length && this.get('password') === this.get('passwordConfirmation'));
  }.property('password', 'passwordConfirmation'),

  actions: {
    submit() {
      if (this.get('passwordsMatch')) {
        this.set('showError', false);
        const url = `${config.API_NAMESPACE}/password_resets/`;

        ajax(url, {
          type: 'PUT',
          data: {
            user: {
              reset_password_token: this.get('token'),
              password: this.get('password'),
              password_confirmation: this.get('passwordConfirmation')
            }
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