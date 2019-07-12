import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  secondaryBackground: true,
  fastboot: service('session'),

  actions: {
    forgotPassword() {
      this.transitionToRoute('forgot-password');
    },

    reconfirm: function(email){
      this.transitionToRoute('register.reconfirm', {
        queryParams: {
          email: email
        }
      });
    }
  }
});
