import Ember from 'ember';

const {
  inject,
  get,
  set
} = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  userService: inject.service('user'),

  actions: {
    authenticate: function(callback) {
      const data = this.getProperties('identification', 'password');
      const promise = get(this, 'session').authenticate('simple-auth-authenticator:devise', data);

      callback(promise);

      return promise.catch((response) => {
        // resend confirmation email
        if (response.error.indexOf('confirm') !== -1) {
          get(this, 'userService').resendConfirmation(data.identification);
          set(this, 'error', `You have to confirm your account before continuing. We've sent an email to ${data.identification} with confirmation instructions.`);
        } else {
          set(this, 'error', response.error);
        }
      });
    }
  }
});
