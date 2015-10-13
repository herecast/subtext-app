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
    const mixpanel = this.get('mixpanel');

    if (user && user.get('isLoaded')) {
      mixpanel.identify(user.get('userId'));
      mixpanel.peopleSet({
        name: user.get('name')
      });

      const intercom = this.get('intercom');

      intercom.boot(user);
    } else {
      // we have two scenarios here. 1 -- the user is unregistered and has no
      // mixpanel cookie. 2 -- the user is not signed in, but has an existing
      // mixpanel cookie from an old session.
      const distinct_id = mixpanel.getDistinctId();
      const emailRegexp = /\S+@\S+\.\S+/;
      // mixpanel's automatically assigned distinct IDs are long strings
      // of alphanumeric and other characters, whereas our distinct IDs
      // are either email addresses or integers
      if (!emailRegexp.test(distinct_id) && isNaN(distinct_id)) {
        if (~distinct_id.indexOf('subtext')) {
          mixpanel.identify(distinct_id);
        } else {
          mixpanel.identify('subtext_' + distinct_id);
          // ensure creation of a profile
          mixpanel.peopleSet({
            name: 'subtext_' + distinct_id
          });
        }
      } // no need to do anything in the 'else' situation since they are already
      // identified appropriately.
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
