import Ember from 'ember';

const {
  get, set,
  inject,
  computed,
  isBlank,
  isPresent
} = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
  windowLocation: inject.service('windowLocation'),
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
          }
        }, (response) => {
          if (isBlank(response)) {
            // assuming a blank response is a 200 ok
            set(this, 'showConfirmation', true);
          } else {
            set(this, 'serverErrors', response.errors);
            set(this, 'showErrors', true);
          }
        });
      } else {
        set(this, 'showErrors', true);
      }
    }
  }
});
