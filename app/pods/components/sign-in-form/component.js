import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  computed,
  get,
  set,
  inject
} = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: "form",
  session: inject.service('session'),
  classNames: ['SignInForm'],
  userMustConfirm: false,
  _routing: inject.service('-routing'),
  'data-test-component': 'sign-in-form',

  hasError: Ember.computed('userMustConfirm', 'error', function(){
    return get(this, 'userMustConfirm') || !Ember.isEmpty(get(this, 'error'));
  }),

  forgotPasswordUrl: computed(function() {
    return "/forgot-password";
  }),

  submit() {
    this.authenticate();
  },

  authenticate() {
    let { identification, password } =  this.getProperties('identification', 'password');

    return new Ember.RSVP.Promise((resolve, reject) => {
      get(this, 'session').authenticate('authenticator:application', identification, password).then(() => {
        const afterAuthenticate = get(this, 'afterAuthenticate');
        if (afterAuthenticate) {
          afterAuthenticate();
        }
        resolve();
      }, (response) => {
        // resend confirmation email
        if (response.error.indexOf('confirm') !== -1) {
          set(this,'userMustConfirm', true);
        } else {
          set(this, 'error', response.error);
        }

        reject();
      });
    });
  },

  actions: {
    authenticate() { return this.authenticate(); },

    clearErrors() {
      set(this, 'userMustConfirm', false);
      set(this, 'error', null);
    },

    forgotPassword() {
      const onForgotPassword = get(this, 'onForgotPassword');
      if (onForgotPassword) {
        onForgotPassword();
      }

      return false;
    },

    reconfirm() {
      const id = get(this, 'identification');
      const onReconfirm = get(this, 'onReconfirm');
      if (onReconfirm) {
        onReconfirm(id);
      } else {
        get(this, '_routing').transitionToRoute('register.reconfirm', null, {
          email: id
        });
      }
    }
  }
});
