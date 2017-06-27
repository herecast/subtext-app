import Ember from 'ember';

const {
  set
} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'sign-in',
  email: null,
  signInModule: 'sign-in-with-email-or-oauth',
  afterAuthenticate() {},

  trackMethodChange(name) {
    this.tracking.push({
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
