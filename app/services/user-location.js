import Evented from '@ember/object/evented';
import Service, { inject as service } from '@ember/service';
import { computed, set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import { run, next } from '@ember/runloop';
import ObjectPromiseProxy from 'subtext-ui/utils/object-promise-proxy';
import moment from 'moment';


export default Service.extend(Evented, {
  cookies: service(),
  session: service(),
  store: service(),
  api: service(),
  geolocation: service(),
  router: service(),
  notify: service('notification-messages'),
  windowLocation: service(),
  fastboot: service(),

  _cookieName: 'userLocationId',
  //Hartford VT Hardcoded Default
  _defaultUserLocationId: 19,
  _previousLocationId: null,
  _activeUserLocationId: null,

  isLoadingLocation: false,

  init() {
    this._super(...arguments);

    if (get(this, 'session.isAuthenticated')) {
      this._loadUserLocationFromCurrentUser();
    } else {
      this._loadUserLocationIdFromCookie(true);
    }
  },

  activeUserLocationId: computed('_activeUserLocationId', 'session.isAuthenticated', function() {
    const activeUserLocationId = get(this, '_activeUserLocationId');
    let userLocationId;

    if (get(this, 'session.isAuthenticated')) {
      userLocationId = this._loadUserLocationFromCurrentUser();//not a promise
    } else if (isPresent(activeUserLocationId)) {
      userLocationId = activeUserLocationId;
    } else {
      userLocationId = get(this, '_defaultUserLocationId');
    }

    return userLocationId;
  }),

  userLocation: computed('activeUserLocationId', function() {
    const promise = new Promise((resolve, reject) => {
      const activeUserLocationId = get(this, 'activeUserLocationId');

      if (isPresent(activeUserLocationId) && activeUserLocationId) {
        const cachedLocation = get(this, 'store').peekRecord('location', activeUserLocationId);

         if (isPresent(cachedLocation)) {
           resolve(cachedLocation);
         } else {
           get(this, 'store').findRecord('location', activeUserLocationId)
           .then((location) => {
             resolve(location);
           })
           .catch(() => {
             reject();
           });
         }
      } else {
        reject();
      }
    });

    return ObjectPromiseProxy.create({promise});
  }),

  goToLocationFeed(locationId) {

    this.saveUserLocationFromId(locationId);

    return next(() => {
      let transition = get(this, 'router').transitionTo('feed');

      transition._keepDefaultQueryParamValues = false;

      return transition;
    });
  },

  saveUserLocationFromId(locationId) {
    if (get(this, 'session.isAuthenticated')) {
      set(this, 'isLoadingLocation', true);
      this._getLocationFromId(locationId)
      .then((location) => {
        return this._saveCurrentUserLocation(location);
      })
      .then((location) => {
        this._writeUserLocationIdToCookie(location.id);
      })
      .catch(() => {
        get(this, 'notify').error('There was an issue saving location. Please try again.');
      })
      .finally(() => {
        set(this, 'isLoadingLocation', false);
      });
    } else {
      this._writeUserLocationIdToCookie(locationId);
    }
  },

  checkLocationMatches(query) {
    return new Promise((resolve, reject) => {
      if (isPresent(query)) {
        get(this, 'api').getLocations(query)
        .then(locationMatches => {
          resolve(locationMatches);
        })
        .catch(() => {
          reject();
        });
      } else {
        resolve([]);
      }
    });
  },

  locateUser() {
    return new Promise((resolve, reject) => {
      get(this, 'geolocation').getCurrentPosition()
      .then((userLocationWithCoords) => {
        const { coords } = userLocationWithCoords;
        get(this, 'api').getLocationFromCoords(coords.latitude, coords.longitude)
        .then((userLocation) => {
          resolve(userLocation);
        });
      })
      .catch(() => {
        get(this, 'notify').error('It looks like location service is blocked or timed out. Please allow location access to use this feature and try again.');
        reject();
      });
    });
  },

  _setActiveLocationId(userLocationId) {
    const _activeUserLocationId = get(this, '_activeUserLocationId');

    if (isPresent(_activeUserLocationId) && parseInt(userLocationId) !== parseInt(_activeUserLocationId)) {
      run.next(() => {
        this.trigger('userLocationChanged', userLocationId);
      });
    }

    set(this, '_previousLocationId', _activeUserLocationId);

    set(this, '_activeUserLocationId', userLocationId);
  },

  _loadUserLocationFromCurrentUser() {
    const currentUser = get(this, 'session.currentUser');

    if (currentUser && isPresent(get(currentUser, 'locationId'))) {
      const currentUserLocationId = get(currentUser, 'locationId');
      this._writeUserLocationIdToCookie(currentUserLocationId);
      return currentUserLocationId;
    } else {
      this._scheduleLocationChangeAfteCurrentUserLoads();
      return this._loadUserLocationIdFromCookie(false);
    }
  },

  _scheduleLocationChangeAfteCurrentUserLoads() {
    const currentUser = get(this, 'session.currentUser');

    if (currentUser && currentUser.then) {
      currentUser.then((user) => {
        this._writeUserLocationIdToCookie(get(user, 'locationId'));
      });
    }
  },

  _loadUserLocationIdFromCookie(setActiveLocationId=true) {
    const cookies = get(this, 'cookies');
    const cookieName = get(this, '_cookieName');
    const userLocationId = cookies.read(cookieName) || get(this, '_defaultUserLocationId');

    if (setActiveLocationId && userLocationId) {
      this._setActiveLocationId(userLocationId);
    }

    return userLocationId;
  },

  _writeUserLocationIdToCookie(locationId) {
    this._setActiveLocationId(locationId);

    const cookies = get(this, 'cookies');
    const cookieName = get(this, '_cookieName');
    const windowLocation = get(this, 'windowLocation');

    cookies.write(cookieName, locationId, {
      path: '/',
      secure: windowLocation.protocol() === 'https',
      expires: moment().add(5, 'years').toDate()
    });
  },

  _getLocationFromId(locationId) {
    return new Promise((resolve) => {
      get(this, 'session.currentUser')
      .then(() => {
        let storeLocation = get(this, 'store').peekRecord('location', locationId);

        if (isPresent(storeLocation)) {
          resolve(storeLocation);
        } else {
          run(() => {
            get(this, 'store').findRecord('location', locationId)
            .then((location) => {
              resolve(location);
            })
            .catch(() => {
              get(this, 'notify').error('There was a problem retrieving location. Please try again.');
            });
          });
        }
      });
    });
  },

  _saveCurrentUserLocation(location) {
    return new Promise((resolve) => {
      get(this, 'session.currentUser')
      .then(currentUser => {
        set(currentUser, 'location', location);
        run(() => {
          currentUser.save()
          .then(() => {
            resolve(location);
          });
        });
      });
    });
  }
});
