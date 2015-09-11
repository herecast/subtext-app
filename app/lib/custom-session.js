import Ember from 'ember';
import SimpleAuthSession from 'simple-auth/session';
import config from '../config/environment';
import ajax from 'ic-ajax';

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

  setupCurrentUser: function() {
    const user = this.get('currentUser');

    if (user && user.get('isLoaded')) {
      const mixpanel = this.get('mixpanel');

      mixpanel.identify(user.get('userId'));
      mixpanel.peopleSet({
        name: user.get('name')
      });

      const intercom = this.get('intercom');

      intercom.boot(user);
    }
  }.observes('currentUser.isLoaded'),

  currentUser: function() {
    const email = this.get('secure.email');

    if (Ember.isPresent(email)) {
      return this.get('userService').getCurrentUser();
    }
  }.property('secure.email'),

  userName: Ember.computed.oneWay('currentUser.name'),

  // Sets default location if a user is logged out
  userLocation: function() {
    const user = this.get('currentUser');

    if (Ember.isPresent(user)) {
      return user.get('location');
    }
  }.property('currentUser.location')
});
