import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  tracking: service(),
  'data-test-component': 'sign-in',
  email: null,
  signInModule: 'sign-in-with-password',
  alternateSignInMessage: false,

  trackMethodChange(name) {
    get(this, 'tracking').push({
      event: 'sign-in-method-change',
      selected: name
    });
  },

  actions: {
    changeModule(name) {
      set(this, 'signInModule', name);

      this.trackMethodChange(name);

      return false;
    }
  }
});
