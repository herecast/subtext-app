import Ember from 'ember';

const { get, set, computed, inject } = Ember;

export default Ember.Component.extend({
  classNames: ['SignInRegisterMenu'],
  classNameBindings: ['tab'],
  _routing: inject.service('-routing'),
  tab: 'sign-in',
  isSignIn: computed.equal('tab', 'sign-in'),
  isRegister: computed.equal('tab', 'register'),

  actions: {
    reconfirm: function(email){
      const action = get(this, 'action');
      if (action) {
        action();
      }

      get(this, '_routing').transitionTo('register.reconfirm', null, {
        email: email
      });
    },
    forgotPassword() {
      const action = get(this, 'action');
      if (action) {
        action();
      }

      get(this, '_routing').transitionTo('forgot-password');
    },
    didSignIn() {
      const action = get(this, 'action');
      if (action) {
        action();
      }
    },
    didRegister() {
      const action = get(this, 'action');
      if (action) {
        action();
      }

      get(this, '_routing').transitionTo('register.complete');
    },
    changeMode(ctx) {
      set(this, 'tab', ctx);
    }
  }
});
