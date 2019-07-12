import Evented from '@ember/object/evented';
import Service, { inject as service } from '@ember/service';
import { computed, set, get } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import { run, next, later } from '@ember/runloop';
import ObjectPromiseProxy from 'subtext-app/utils/object-promise-proxy';
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
  defaultUserLocationId: 19,
  _previousLocationId: null,
  _activeUserLocationId: null,
  _minimumLoadingDuration: 1200,

  loadingLocation: null,
  isLoadingLocation: notEmpty('loadingLocation'),

  init() {
    this._super(...arguments);

    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      this._loadUserLocationFromCurrentUser();
    } else {
      this._loadUserLocationIdFromCookie(true);
      get(this, 'session').on('authenticationSucceeded', this, '_loadUserLocationFromCurrentUser');
    }
  },

  getActiveUserLocationId(allowDefault=true) {
    const activeUserLocationId = get(this, '_activeUserLocationId');
    let userLocationId = null;

    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      userLocationId = this._loadUserLocationFromCurrentUser();
    } else if (isPresent(activeUserLocationId)) {
      userLocationId = activeUserLocationId;
    } else if (allowDefault){
      userLocationId = get(this, 'defaultUserLocationId');
    }

    return userLocationId;
  },

  activeUserLocationId: computed('_activeUserLocationId', 'session.isAuthenticated', function() {
    return this.getActiveUserLocationId();
  }),

  userLocation: computed('activeUserLocationId', function() {
    const promise = new Promise((resolve, reject) => {
      const activeUserLocationId = get(this, 'activeUserLocationId');

      if (!get(this, 'fastboot.isFastBoot') && isPresent(activeUserLocationId) && activeUserLocationId) {
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

  goToLocationFeed(location) {
    this.saveUserLocation(location);

    next(() => {
      let transition = get(this, 'router').transitionTo('feed');

      transition._keepDefaultQueryParamValues = false;

      transition.retry();
    });
  },

  setActiveUserLocationWithoutSaving(locationId) {
    set(this, '_activeUserLocationId', locationId);
  },

  saveUserLocation(location) {
    set(this, 'loadingLocation', location);

    if (get(this, 'session.isAuthenticated')) {
      this._getLocationFromId(get(location, 'id'))
      .then((location) => {
        return this._saveCurrentUserLocation(location);
      })
      .then((location) => {
        this._writeUserLocationIdToCookie(location);
      })
      .catch(() => {
        get(this, 'notify').error('There was an issue saving location. Please try again.');
      })
      .finally(() => {
        set(this, 'loadingLocation', null);
      });
    } else {
      this._writeUserLocationIdToCookie(location);
      later(() => {
        set(this, 'loadingLocation', null);
      }, get(this, '_minimumLoadingDuration'));
    }
  },

  checkLocationMatches(query) {
    return new Promise((resolve, reject) => {
      if (isPresent(query)) {
        get(this, 'store').query('location', {query})
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
          get(this, 'store').pushPayload('location', userLocation);
          const locationModel = get(this, 'store').peekRecord('location', userLocation.location.id);
          resolve(locationModel);
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

      this._writeUserLocationIdToCookie(get(currentUser, 'location'));
      return get(currentUser, 'locationId');
    } else {
      this._scheduleLocationChangeAfteCurrentUserLoads();
      return this._loadUserLocationIdFromCookie(false);
    }
  },

  _scheduleLocationChangeAfteCurrentUserLoads() {
    const currentUser = get(this, 'session.currentUser');

    if (currentUser && currentUser.then) {
      currentUser.then((user) => {
        this._writeUserLocationIdToCookie(get(user, 'location'));
      });
    }
  },

  _loadUserLocationIdFromCookie(setActiveLocationId=true) {
    const cookies = get(this, 'cookies');
    const cookieName = get(this, '_cookieName');
    const userLocationId = cookies.read(cookieName) || get(this, 'defaultUserLocationId');

    if (setActiveLocationId && userLocationId) {
      this._setActiveLocationId(userLocationId);
    }

    return userLocationId;
  },

  hasLocationStoredInCookie() {
    const cookies = get(this, 'cookies');
    const cookieName = get(this, '_cookieName');
    const cookieUserLocationId = cookies.read(cookieName) || null;
    return isPresent(cookieUserLocationId);
  },

  _writeUserLocationIdToCookie(location) {
    const locationId = get(location, 'id');
    const locationName = get(location, 'name');

    this._setActiveLocationId(locationId);

    const cookies = get(this, 'cookies');
    const cookieName = get(this, '_cookieName');
    const windowLocation = get(this, 'windowLocation');

    const path = '/';
    const secure = windowLocation.protocol() === 'https';
    const expires = moment().add(5, 'years').toDate();
    const cookieOptions = {path, secure, expires};

    cookies.write(cookieName, locationId, cookieOptions);

    if (isPresent(locationName)) {
      cookies.write('userLocationName', locationName, cookieOptions);
    }
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
