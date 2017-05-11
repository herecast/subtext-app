import Ember from 'ember';

const { get, set, inject } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  session: inject.service('session'),
  queryParams: ['auth_token'],
  auth_token: null,

  actions: {
    forgotPassword() {
      this.transitionToRoute('forgot-password');
    },
    wasAuthenticated() {
      const attemptedTransition = get(this, 'session.attemptedTransition');

      if (attemptedTransition) {
        attemptedTransition.retry();
        set(this, 'session.attemptedTransition', null);
      } else {
        this.send('transitionAfterAuthentication');
      }
    },
    reconfirm: function(email){
      this.transitionToRoute('register.reconfirm', {
        queryParams: {
          email: email
        }
      });
    },
    join() {
      this.transitionToRoute('register');
    },
    clearToken() {
      set(this, 'auth_token', null);
    }
  }
});
