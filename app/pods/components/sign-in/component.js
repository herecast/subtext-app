import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tracking: service(),
  'data-test-component': 'sign-in',
  email: null,
  signInModule: 'sign-in-with-password',
  alternateSignInMessage: false,

  isRegistering: equal('signInModule', 'register'),
  isSigningIn: equal('signInModule', 'sign-in-with-password'),


  actions: {
    changeModule(name) {
      set(this, 'signInModule', name);
    },

    afterAuthenticate() {
      if (get(this, 'afterAuthenticate')) {
        get(this, 'afterAuthenticate')();
      }
    }
  }
});
