import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  secondaryBackground: true,
  session: service('session'),
  queryParams: ['auth_token'],
  auth_token: null,

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
    },
    clearToken() {
      set(this, 'auth_token', null);
    }
  }
});
