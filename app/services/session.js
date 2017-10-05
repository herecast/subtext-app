import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

const {
  isPresent,
  set,
  inject,
  get,
  computed,
  observer,
  RSVP: {Promise}
} = Ember;

export default SessionService.extend({
  api         : inject.service('api'),
  userService : inject.service('user'),
  intercom    : inject.service('intercom'),
  fastboot    : inject.service(),
  userLocationService: Ember.inject.service('user-location'),
  sequenceTrackers: {},
  startedOnIndexRoute: false,

  // Used in templates all over app.
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  signOut() {
    return get(this, 'api').signOut().then(() => {
      this.invalidate();
    });
  },

  bootIntercom: observer('isAuthenticated', 'currentUser.id', function() {
    const currentUser = get(this, 'currentUser');

    if(get(this, 'isAuthenticated') && currentUser) {
      this.get('intercom').update(currentUser);
    }
  }),

  currentUser: computed('data.authenticated.email', function() {
    if (isPresent(get(this, 'data.authenticated.email'))) {
      return get(this, 'userService').getCurrentUser();
    }
  }),

  userName: computed.oneWay('currentUser.name'),

  userLocation: computed.alias('userLocationService.location.name'),

  signInWithToken(token) {
    return get(this, 'api').signInWithToken(token).then((data)=> {
      return this.authenticate(
        'authenticator:restore', {
          email: data.email,
          token: data.token
        }
      );
    });
  },

  incrementEventSequence(sequenceName) {
    const sequenceTrackers = get(this, 'sequenceTrackers');
    let currentTrackerIndex = isPresent(sequenceTrackers[sequenceName]) ? (sequenceTrackers[sequenceName] + 1) : 0;

    set(this, `sequenceTrackers.${sequenceName}`, currentTrackerIndex);

    return Promise.resolve(currentTrackerIndex);
  }

});
