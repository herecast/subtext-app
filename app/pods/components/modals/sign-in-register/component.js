import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import { computed, set, get } from '@ember/object';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

export default ModalInstance.extend({
  router: service(),
  model: 'sign-in',

  isSignIn: equal('model', 'sign-in'),
  isRegister: equal('model', 'register'),

  alternateSignInMessage: computed('model', function() {
    const model = get(this, 'model');

    if (get(model, 'alternateSignInMessage')) {
      return get(model, 'alternateSignInMessage');
    }

    return false;
  }),

  actions: {
    reconfirm(email) {
      // IDEA: Open secondary modal here?
      get(this, 'router').transitionTo('register.reconfirm', null, {
        email: email
      });
    },
    forgotPassword() {
      // IDEA: Open secondary modal here?
      get(this, 'router').transitionTo('forgot-password');
    },
    didSignIn() {
      this.ok();
    },
    didRegister() {
      get(this, 'router').transitionTo('register.complete');
    },
    changeMode(ctx) {
      set(this, 'model', ctx);
    }
  }
});
