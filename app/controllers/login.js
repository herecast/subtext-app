import Ember from 'ember';
import Configuration from 'ember-simple-auth/configuration';

const { get, set, inject } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  session: inject.service('session'),
  cookies: inject.service('cookies'),
  modalService: inject.service('modals'),

  actions: {
    forgotPassword() {
      this.transitionToRoute('forgot-password');
    },
    wasAuthenticated() {
      const attemptedTransition = get(this, 'session.attemptedTransition');
      const cookies = get(this, 'cookies');
      const redirectTarget = cookies.read('ember_simple_auth-redirectTarget');

      if (attemptedTransition) {
        attemptedTransition.retry();
        set(this, 'session.attemptedTransition', null);
      } else if(redirectTarget) {
        this.transitionToRoute(redirectTarget);
        cookies.clear('ember_simple_auth-redirectTarget');
      } else {
        this.transitionToRoute(Configuration.routeAfterAuthentication);
      }
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
