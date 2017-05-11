import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

/* global dataLayer */

const {
  computed,
  get,
  set,
  isEmpty,
  RSVP: {Promise},
  inject
} = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: "form",
  session: inject.service('session'),
  classNames: ['SignInForm'],
  userMustConfirm: false,
  _routing: inject.service('-routing'),

  hasError: computed('userMustConfirm', 'error', function(){
    return get(this, 'userMustConfirm') || !isEmpty(get(this, 'error'));
  }),

  submit() {
    this.authenticate();
  },

  trackSignInClick() {
    if(typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'sign-in-submit-click',
        sign_in_type: 'password'
      });
    }
  },

  authenticate() {
    let { identification, password } =  this.getProperties('identification', 'password');

    this.trackSignInClick();

    return new Promise((resolve, reject) => {
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
      get(this, '_routing').transitionTo('forgot-password');
    },

    reconfirm() {
      const id = get(this, 'identification');
      get(this, '_routing').transitionTo('register.reconfirm', null, {
        email: id
      });
    }
  }
});
