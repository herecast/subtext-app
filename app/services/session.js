import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const { observer, computed } = Ember;

export default SessionService.extend({
  api: Ember.inject.service('api'),
  userService: Ember.inject.service('user'),
  intercom: Ember.inject.service('intercom'),

  signOut() {
    const api = this.get('api');

    return api.signOut().then(() => {
      this.invalidate();
    });
  },

  setupCurrentUser: observer('currentUser.isLoaded', function() {
    const user = this.get('currentUser');

    if (user && user.get('isLoaded')) {
      const intercom = this.get('intercom');
      intercom.boot(user);
    }
  }),

  currentUser: computed('data.authenticated.email', function() {
    const email = this.get('data.authenticated.email');

    if (Ember.isPresent(email)) {
      return this.get('userService').getCurrentUser();
    }
  }),

  userName: Ember.computed.oneWay('currentUser.name'),

  // Sets default location if a user is logged out
  userLocation: computed('currentUser.location', function() {
    const user = this.get('currentUser');

    if (Ember.isPresent(user)) {
      return user.get('location');
    }
  })
});
