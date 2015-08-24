import Ember from 'ember';
import SimpleAuthSession from 'simple-auth/session';

export default SimpleAuthSession.extend({
  userService: Ember.inject.service('user'),
  mixpanel: Ember.inject.service('mixpanel'),
  intercom: Ember.inject.service('intercom'),

  getCurrentUser: function() {
    const email = this.get('secure.email');

    if (Ember.isPresent(email) && Ember.isBlank(this.get('currentUser'))) {
      return this.get('userService').getCurrentUser().then((user) => {
        this.set('currentUser', user);

        const mixpanel = this.get('mixpanel');

        mixpanel.identify(user.get('userId'));
        mixpanel.peopleSet({
          name: user.get('name')
        });

        const intercom = this.get('intercom');

        intercom.boot(user);
      }).catch(() => {
        this.set('currentUser', null);
      });
    }
  },

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
    } else {
      return 'Hartford, VT';
    }
  }.property('currentUser.location')
});
