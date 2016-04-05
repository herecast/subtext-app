import Ember from 'ember';
import SimpleAuthSession from 'simple-auth/session';
import config from '../config/environment';
import ajax from 'ic-ajax';

const { observer, computed } = Ember;

export default SimpleAuthSession.extend({
  userService: Ember.inject.service('user'),
  mixpanel: Ember.inject.service('mixpanel'),
  intercom: Ember.inject.service('intercom'),

  signOut() {
    const url = `${config.API_NAMESPACE}/users/logout`;

    return ajax(url, {
      type: 'POST'
    }).then(() => {
      this.invalidate();
    });
  },

  setupCurrentUser: observer('currentUser.isLoaded', function() {
    const user = this.get('currentUser');
    const mixpanel = this.get('mixpanel');

    mixpanel.establishProfile(user);

    if (user && user.get('isLoaded')) {
      const intercom = this.get('intercom');
      intercom.boot(user);
    }
  }),

  currentUser: computed('secure.email', function() {
    const email = this.get('secure.email');

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
