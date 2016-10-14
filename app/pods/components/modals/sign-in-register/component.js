import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import Ember from 'ember';

const { get, set, computed, inject } = Ember;

export default ModalInstance.extend({
  _routing: inject.service('-routing'),
  model: 'sign-in',
  isSignIn: computed.equal('model', 'sign-in'),
  isRegister: computed.equal('model', 'register'),

  actions: {
    reconfirm: function(email){
      // IDEA: Open secondary modal here?
      get(this, '_routing').transitionTo('register.reconfirm', null, {
        email: email
      });
    },
    forgotPassword() {
      // IDEA: Open secondary modal here?
      get(this, '_routing').transitionTo('forgot-password');
    },
    didSignIn() {
      this.ok();
    },
    didRegister() {
      get(this, '_routing').transitionTo('register.complete');
    },
    changeMode(ctx) {
      set(this, 'model', ctx);
    }
  }
});
