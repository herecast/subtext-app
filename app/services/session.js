import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const { isPresent, inject, get, observer, computed } = Ember;

export default SessionService.extend({
  api         : inject.service('api'),
  userService : inject.service('user'),
  intercom    : inject.service('intercom'),

  signOut() {
    return get(this, 'api').signOut().then(() => {
      this.invalidate();
    });
  },

  bootOrUpdateIntercom: observer('currentUser.isLoaded', function() {
    const user = get(this, 'currentUser');

    if (user && get(user, 'isLoaded')) {
      get(this, 'intercom').boot(user);
    }
  }),

  currentUser: computed('data.authenticated.email', function() {
    if (isPresent(get(this, 'data.authenticated.email'))) {
      return get(this, 'userService').getCurrentUser();
    }
  }),

  userName: computed.oneWay('currentUser.name'),

  // Sets default location if a user is logged out
  userLocation: computed('currentUser.location', function() {
    const user = get(this, 'currentUser');

    if (isPresent(user)) {
      return get(user, 'location');
    }
  })
});
