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
      if('action' in this.attrs) {
        this.attrs.action();
      }

      get(this, '_routing').transitionTo('register.reconfirm', null, {
        email: email
      });
    },
    forgotPassword() {
      if('action' in this.attrs) {
        this.attrs.action();
      }

      get(this, '_routing').transitionTo('forgot-password');
    },
    didSignIn() {
      if('action' in this.attrs) {
        this.attrs.action();
      }
    },
    didRegister() {
      if('action' in this.attrs) {
        this.attrs.action();
      }

      get(this, '_routing').transitionTo('register.complete');
    },
    changeMode(ctx) {
      set(this, 'tab', ctx);
    }
  }
});
