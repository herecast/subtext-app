import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const {
  computed,
  get,
  set,
  inject
} = Ember;

export default Ember.Component.extend(trackEvent, {
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

  trackForgotPassword() {
    this.trackEvent('selectNavControl', {
      navControlGroup: 'User Menu',
      navControl: 'Forgot Password'
    });
  },

  trackSignIn() {
    this.trackEvent('signIn', {});
  },

  submit() {
    this.authenticate();
  },

  authenticate() {
    let { identification, password } =  this.getProperties('identification', 'password');

    return new Ember.RSVP.Promise((resolve, reject) => {
      get(this, 'session').authenticate('authenticator:application', identification, password).then(() => {
        this.trackSignIn();
        if('afterAuthenticate' in this.attrs) {
          this.attrs.afterAuthenticate();
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
      this.trackForgotPassword();
      if ('onForgotPassword' in this.attrs) {
        this.attrs.onForgotPassword();
      }

      return false;
    },

    reconfirm() {
      const id = get(this, 'identification');

      if ('onReconfirm' in this.attrs) {
        this.attrs.onReconfirm(id);
      } else {
        get(this, '_routing').transitionToRoute('register.reconfirm', null, {
          email: id
        });
      }
    }
  }
});
