import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  tagName: 'form',
  showError: false,
  showConfirmation: false,
  password: '',
  passwordConfirmation: '',

  passwordsMatch: function() {
    return (this.get('password').length && this.get('password') === this.get('passwordConfirmation'));
  }.property('password', 'passwordConfirmation'),

  actions: {
    submit() {
      if (this.get('passwordsMatch')) {
        this.set('showError', false);
        const token = this.get('token');
        const url = `${config.API_NAMESPACE}/password_resets/${token}`;

        ajax(url, {
          type: 'PUT',
          data: {
            password: this.get('password')
          }
        }).then(() => {
          this.set('showConfirmation', true);
        });
      } else {
        this.set('showError', true);
      }
    }
  }
});