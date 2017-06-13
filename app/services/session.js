import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';

/* global ga */

const {
  isPresent,
  isEmpty,
  run,
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
  routing     : inject.service('-routing'),

  sequenceTrackers: {},

  isFastBoot: computed.alias('fastboot.isFastBoot'),

  clientId: null,
  _clientIdKey: 'dailyuv_session_client_id',
  _gaDelayedCapture: null,

  init() {
    this._super(...arguments);

    if(!get(this, 'isFastBoot')) {
      this.getClientId();
    }
  },

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

  // Sets default location if a user is logged out
  userLocation: computed('currentUser.location', function() {
    const user = get(this, 'currentUser');

    if (isPresent(user)) {
      return get(user, 'location');
    }
  }),

  getClientId() {
    let clientId = get(this, 'clientId');

    if (isEmpty(clientId)) {
      if ((typeof ga === 'undefined') || (typeof ga.getAll === 'undefined')) {
        const keyName = get(this, '_clientIdKey');

        clientId = localStorage.getItem(keyName) || null;

        run.cancel(this._gaDelayedCapture);
        this._gaDelayedCapture = run.later(this, this.getClientId, 3000);
      } else {
        clientId = this._getClientIdFromGa();
      }
    }

    return clientId;
  },

  _getClientIdFromGa() {
    let clientId = null;

    if (typeof ga !== 'undefined' && !Ember.testing) {
      const keyName = get(this, '_clientIdKey');

      clientId = ga.getAll()[0].get('clientId');

      localStorage.setItem(keyName, clientId);
      set(this, 'clientId', clientId);
    }

    return clientId;
  },

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
