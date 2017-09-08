import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get, set,
  inject,
  computed,
  isBlank,
  isPresent
} = Ember;

export default Ember.Component.extend(TestSelector, {
  api: inject.service('api'),
  windowLocation: inject.service('windowLocation'),
  router : inject.service('-routing'),
  notify: inject.service('notification-messages'),
  returnUrl: null,
  tagName: 'form',
  showErrors: false,
  showConfirmation: false,
  password: '',
  passwordConfirmation: '',
  serverErrors: [],

  passwordsMatch: computed('password', 'passwordConfirmation', function() {
    return (get(this, 'password').length && get(this, 'password') === get(this, 'passwordConfirmation'));
  }),

  actions: {
    submit() {
      const returnUrl = get(this, 'returnUrl');
      const windowLocation = get(this, 'windowLocation');

      if (get(this, 'passwordsMatch')) {
        const api = get(this, 'api');
        const notify = get(this, 'notify');
        set(this, 'showErrors', false);

        api.resetPassword({
          user: {
            reset_password_token: get(this, 'token'),
            password: get(this, 'password'),
            password_confirmation: get(this, 'passwordConfirmation')
          }, returnUrl
        }).then(() => {
          set(this, 'showConfirmation', true);
          if(isPresent(returnUrl)) {
            windowLocation.redirectTo(returnUrl);
          } else {
            get(this, 'router').transitionTo('login');
            notify.success('Password Successfully Updated!  Please Sign In.');
          }
        }, (response) => {
          if (isBlank(response)) {
            // assuming a blank response is a 200 ok
            set(this, 'showConfirmation', true);
          } else {
            set(this, 'serverErrors', response.errors);
            notify.error('There was problem updating your password.');
            set(this, 'showErrors', true);
          }
        });
      } else {
        set(this, 'showErrors', true);
      }
    }
  }
});
