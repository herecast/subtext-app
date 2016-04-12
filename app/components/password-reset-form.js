import Ember from 'ember';

const {
  get, set,
  inject,
  computed,
  isBlank
} = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
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
      if (get(this, 'passwordsMatch')) {
        const api = get(this, 'api');
        set(this, 'showErrors', false);

        api.resetPassword({
          user: {
            reset_password_token: get(this, 'token'),
            password: get(this, 'password'),
            password_confirmation: get(this, 'passwordConfirmation')
          }
        }).then(() => {
          // TODO this success condition will never fire
          // because Ember isn't interpreting a 200 ok header
          // with a blank response as success
          set(this, 'showConfirmation', true);
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
