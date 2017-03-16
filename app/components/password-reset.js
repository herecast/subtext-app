import Ember from 'ember';

const { get, inject, observer, computed } = Ember;

export default Ember.Component.extend({
  api: inject.service(),
  notify: inject.service('notification-messages'),

  classNames: ['PasswordReset'],
  showErrors: false,

  isValid: computed('password', 'passwordConfirmation', function() {
    const password = get(this, 'password'),
      passwordConfirmation = get(this, 'passwordConfirmation');

    return Ember.isPresent(password) &&
      password === passwordConfirmation &&
      password.length >= 8;
  }),

  hideErrors: observer('isValid', function() {
    if (this.get('isValid')) {
      this.set('showErrors', false);
    }
  }),

  actions: {
    resetPassword() {
      const notify = get(this, 'notify');

      if (this.get('isValid')) {
        const api = get(this, 'api');
        const data = {
          current_user: {
            user_id: this.get('userId'),
            password: this.get('password'),
            password_confirmation: this.get('passwordConfirmation')
          }
        };

        api.updateCurrentUserPassword(data).then(
          () => { notify.success('Saved New Password!'); },
          (error) => {
            if ('messages' in error) {
              error.messages.forEach((message) => {
                notify.error('Error: ' + message);
              });
            } else {
              notify.error('Error: Unable to save password!');
            }
          }
        ).then(() => {
          const onSubmit = get(this, 'onSubmit');
          if (onSubmit) {
            onSubmit();
          }
        });
      } else {
        notify.error('Error: Unable to save password!');
        this.toggleProperty('showErrors');
      }
    }
  }
});
