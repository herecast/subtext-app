import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: Ember.inject.service('intercom'),

  model() {
    return this.get('session.currentUser');
  },

  setupController(controller, model) {
    this._super(controller, model);

    this.get('session').setupCurrentUser();
  },

  actions: {
    error(errorResponse) {
      const status = errorResponse.errors[0].status;

      if (status === '404') {
        this.transitionTo('error-404');
      } else {
        return true;
      }
    },

    signOut(callback) {
      this.get('intercom').shutdown();
      const promise = this.get('session').signOut();

      callback(promise);
    },

    didTransition: function() {
      const currentUser = this.get('session.currentUser');

      if (Ember.isPresent(currentUser)) {
        this.get('intercom').update();
      }

      return true; // Bubble the didTransition event
    }
  }
});
