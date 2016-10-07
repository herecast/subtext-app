import Ember from 'ember';
import Configuration from 'ember-simple-auth/configuration';

const { get, set, inject } = Ember;

export default Ember.Controller.extend({
  secondaryBackground: true,
  session: inject.service('session'),
  modalService: inject.service('modals'),

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
