import Ember from 'ember';

/* global dataLayer */

const {
  set
} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'sign-in',
  email: null,
  signInModule: 'sign-in-with-email',
  afterAuthenticate() {},

  trackMethodChange(name) {
    if(typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'sign-in-method-change',
        selected: name
      });
    }
  },

  actions: {
    changeModule(name) {
      set(this, 'signInModule', name);

      this.trackMethodChange(name);

      return false;
    }
  }
});
