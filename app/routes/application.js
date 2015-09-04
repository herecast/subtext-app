import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  intercom: Ember.inject.service('intercom'),

  model() {
    return this.get('session.currentUser');
  },

  actions: {
    signOut() {
      this.get('session').signOut();
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
