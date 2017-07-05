import Ember from 'ember';

const {
  set,
  get,
  inject
} = Ember;

export default Ember.Component.extend({
  tracking: inject.service(),
  'data-test-component': 'sign-in',
  email: null,
  signInModule: 'sign-in-with-email-or-oauth',
  afterAuthenticate() {},

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
