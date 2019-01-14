import { reads, oneWay, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { observer, computed, get, set , setProperties} from '@ember/object';
import { Promise } from 'rsvp';
import Evented from '@ember/object/evented';
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend(Evented, {
  api         : service('api'),
  userService : service('user'),
  intercom    : service('intercom'),
  fastboot    : service(),
  store       : service(),
  userLocationService: service('user-location'),

  startedOnIndexRoute: false,

  init() {
    this._super(...arguments);
    setProperties(this, {
      sequenceTrackers: {}
    });
  },

  // Used in templates all over app.
  isFastBoot: reads('fastboot.isFastBoot'),

  signOut() {
    return get(this, 'api').signOut().then(() => {
      this.invalidate();
    });
  },

  bootIntercom: observer('isAuthenticated', 'currentUser.name', function() {
    //const currentUser = get(this, 'currentUser');

    if (get(this, 'isAuthenticated') && get(this, 'currentUser.name')) {
      get(this, 'currentUser')
      .then((currentUser) => {
          this.get('intercom').update(currentUser);
      });
    }
  }),


  currentUser: computed('data.authenticated.email', function() {
    if (!get(this, 'fastboot.isFastBoot') && isPresent(get(this, 'data.authenticated.email'))) {
      return get(this, 'store').findRecord('current-user', 'self');
    } else if (get(this, 'fastboot.isFastBoot')) {
      return Promise.resolve();
    }
  }),

  userId: oneWay('currentUser.userId'),

  userName: oneWay('currentUser.name'),

  userLocation: alias('userLocationService.location.name'),

  userCanPublishNews: alias('currentUser.canPublishNews'),

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
