import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  intercom: Ember.inject.service('intercom'),

  beforeModel() {
    const session = this.get('session');

    return session.getCurrentUser();
  },

  actions: {
    signOut() {
      ajax('/users/sign_out', {type: 'delete'}).then(() => {
        window.location.reload();
      });
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
