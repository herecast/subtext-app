import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  classNames: ['PasswordReset'],
  showErrors: false,

  isValid: function() {
    return Ember.isPresent(this.get('password')) && Ember.isPresent(this.get('passwordConfirmation')) && (this.get('password') === this.get('passwordConfirmation'));
  }.property('password', 'passwordConfirmation'),

  hideErrors: function() {
    if (this.get('isValid')) {
      this.set('showErrors', false);
    }
  }.observes('isValid'),

  actions: {
    resetPassword() {
      if (this.get('isValid')) {
        const url = `/${config.API_NAMESPACE}/current_user`;
        const data = {
          current_user: {
            password: this.get('password'),
            password_confirmation: this.get('passwordConfirmation')
          }
        };

        ajax(url, {
          type: 'PUT',
          data: data,
        }).then(() => {
          this.sendAction('onSubmit');
        });
      } else {
        this.toggleProperty('showErrors');
      }
    }
  }
});
