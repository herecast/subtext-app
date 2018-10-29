import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Component.extend(TestSelector, {
  api: service('api'),
  windowLocation: service('windowLocation'),
  router : service(),
  notify: service('notification-messages'),
  returnUrl: null,
  tagName: 'form',
  showErrors: false,
  showConfirmation: false,
  password: '',
  passwordConfirmation: '',

  init() {
    this._super(...arguments);

    set(this, 'serverErrors', []);
  },

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
