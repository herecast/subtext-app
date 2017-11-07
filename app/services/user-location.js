import Ember from 'ember';
import moment from 'moment';
import config from 'subtext-ui/config/environment';
import ObjectPromiseProxy from 'subtext-ui/utils/object-promise-proxy';

import {startsWith} from 'lodash';

const {inject, get, set, computed, isBlank, isPresent, assign, RSVP} = Ember;


/**
 * The `user-location` service handles the state for the selected `Location` model.
 *
 * When a user visits a `location` route, it is set as the `activeLocation` here
 * to provide a convenience to other listeners for which location is currently being viewed.
 * Content (such as news) is then loaded with that given location id.
 *
 * When the user explicitly chooses a location, the service will store the user's
 * selection to a cookie and on the current-user if they are currently logged in.
 * When the user returns, unless they go directly to a location route, we redirect the user
 * to the location route for the saved location id.
 *
 * We also provide an ability to automatically identify the user's `Location`
 * based on their HTML5 geolocation.
 *
 */
export default Ember.Service.extend(Ember.Evented, {
  defaultLocationId: 'sharon-vt',
  cookies: inject.service(),
  geolocation: inject.service(),
  session: inject.service(),
  store: inject.service(),
  api: inject.service(),
  windowLocation: inject.service('window-location'),
  history: inject.service(),
  fastboot: inject.service(),
  routing: inject.service('-routing'),

  currentRouteName: computed.oneWay('history.currentRouteName'),
  currentRouteParams: computed.oneWay('history.currentRoute.params'),

  // Location loaded from cookie
  _cookieLocationId: null,
  _cookieLocationIsConfirmed: false,

  // Location loaded from user
  _userLocationId: computed.alias('session.currentUser.locationId'),
  _userLocationIsConfirmed: computed.alias('session.currentUser.locationConfirmed'),

  hasActiveLocation: computed.bool('activeLocation.id'),
  locationMismatch: computed('activeLocation.id', 'selectedLocation.id', function() {
    return get(this, 'activeLocation.id') !== get(this, 'selectedLocation.id');
  }),

  locationIsConfirmed: computed('_userLocationIsConfirmed', '_cookieLocationIsConfirmed', function() {
    const userConfirmed = get(this, '_userLocationIsConfirmed');
    const cookieConfirmed = get(this, '_cookieLocationIsConfirmed');

    return userConfirmed || cookieConfirmed;
  }),

  /**
   * The activeLocationId is set when the user visits a location route.
   */
  activeLocationId: null,

  activeLocation: computed('activeLocationId', function() {
    const promise = new RSVP.Promise((resolve, reject) => {
      const locationId = get(this, 'activeLocationId');
      if (isPresent(locationId)) {
        get(this, 'store').findRecord('location', locationId)
          .then(resolve)
          .catch(reject);
      } else {
        resolve(new Error('Cannot load activeLocation without an activeLocationId'));
      }
    });

    return ObjectPromiseProxy.create({promise});
  }),

  /**
   * The selectedLocationId is the Location previously selected by the user.
   * If the user is authenticated, it takes precedence over the location id stored in a cookie.
   */
  selectedLocationId: computed('_userLocationId', '_cookieLocationId',
    '_cookieLocationIsConfirmed', function() {
    const _cookieLocationId = get(this, '_cookieLocationId');
    const _cookieLocationIsConfirmed = get(this, '_cookieLocationIsConfirmed');
    const _userLocationId = get(this, '_userLocationId');

    if(_cookieLocationIsConfirmed && _cookieLocationId) {
      // Prefer cookie location if confirmed.
      return _cookieLocationId;

    } else if(_userLocationId) {
      // If cookie location is not confirmed, prefer user location.
      return _userLocationId;
    }
  }),

  selectedLocation: computed('selectedLocationId', function() {
    const promise = new RSVP.Promise((resolve, reject) => {
      const selectedLocationId = get(this, 'selectedLocationId');

      if (isPresent(selectedLocationId)) {
        get(this, 'store').findRecord('location', selectedLocationId)
          .then(resolve)
          .catch(() => {
            // Clear the cookie in case the user has a bad value set.
            this.clearLocationCookie();
            if (!get(this, 'fastboot.isFastBoot')) {
              this.locateUser()
                .then(resolve)
                .catch(reject);
            }
          });
      } else {
        // Locate the user ONLY if they are not on a location route or being presented with a location menu
        if (!get(this, 'fastboot.isFastBoot') && !get(this, 'isLocationRouteActive') && !get(this, 'isLocationRedirectRouteActive')) {
          this.locateUser()
            .then(resolve)
            .catch(reject);
        } else {
          // No Location has been selected yet, it's likely the user is on a location menu

          get(this, 'store').findRecord('location',
            get(this, 'defaultLocationId')
          ).then(resolve);
        }
      }
    });

    return ObjectPromiseProxy.create({promise});
  }),

  selectedOrDefaultLocationId: computed.or('selectedLocationId', 'defaultLocationId'),

  locationId: computed.readOnly('location.id'),
  location: computed('activeLocationId', 'selectedLocationId', 'defaultLocationId', function() {
    const activeLocationId = get(this, 'activeLocationId');
    const selectedLocationId = get(this, 'selectedLocationId');
    const defaultLocationId = get(this, 'defaultLocationId');

    let location;

    if(activeLocationId) {
      location = get(this, 'activeLocation');
    } else if(selectedLocationId) {
      location = get(this, 'selectedLocation');
    } else {
      location = get(this, 'store').findRecord('location', defaultLocationId);
    }

    return ObjectPromiseProxy.create({
      promise: location
    });
  }),


  /**
   * Determine if we're currently on a Location route
   *
   * @returns Boolean
   */
  isLocationRouteActive: computed('currentRouteName', function() {
    return startsWith(get(this, 'currentRouteName'), 'location');
  }),

  /**
   * Determine if we're currently on a route which shows the location-menu,
   * thereby requiring the user to explicitly choose their location
   *
   * @returns Boolean
   */
  isLocationRedirectRouteActive: computed('currentRouteName', function() {
    const locationRedirectRoutes = config.locationRedirectRoutes || [];
    return locationRedirectRoutes.indexOf(get(this, 'currentRouteName')) !== -1;
  }),

  /**
   * Set the given Location ID as the ID of the active Location selected for this session.
   * Also, save the Location ID to a cookie if one has not been saved previously.
   *
   * @param locationId
   */
  setActiveLocationId(locationId) {
    const previousActiveLocationId = get(this, 'activeLocationId');

    if(previousActiveLocationId !== locationId) {
      set(this, 'activeLocationId', locationId);

      this.trigger('locationDidChange', locationId);

      const cookieLocationId = get(this, '_cookieLocationId');
      if (isBlank(cookieLocationId)) {
        this.saveLocationIdToCookie(locationId);
      }
    }

  },

  /**
   * Save the given locationId to a cookie and to the current user if they're logged in.
   *
   * @param locationId
   */
  saveSelectedLocationId(locationId) {
    // Write cookie immediately
    this.saveLocationIdToCookie(locationId);
    this.saveLocationConfirmed();

    if (get(this, 'session.isAuthenticated')) {
      this.saveCurrentUserLocationId(locationId);
    }
  },

  saveCurrentUserLocationId(locationId) {
    const currentUser = get(this, 'session.currentUser');

    if (currentUser) {
      currentUser.then((user) => {
        if(!get(this, 'isDestroying')) {
          if(get(user, 'locationId') !== locationId) {
            set(user, 'locationId', locationId);
            user.save();
          }
        }
      });
    }
  },

  saveLocationConfirmed() {
    this.saveLocationConfirmedCookie();

    if (get(this, 'session.isAuthenticated')) {
      this.saveCurrentUserLocationConfirmed();
    }
  },

  saveLocationConfirmedCookie() {
    const cookies = get(this, 'cookies');
    const windowLocation = get(this, 'windowLocation');

    cookies.write('locationConfirmed', true, {
      path: '/',
      secure: windowLocation.protocol() === 'https',
      expires: moment().add(5, 'years').toDate()
    });

    set(this, '_cookieLocationIsConfirmed', true);
  },

  saveCurrentUserLocationConfirmed() {
    const currentUser = get(this, 'session.currentUser');

    if (currentUser) {
      currentUser.then((user) => {
        if(!get(user, 'locationConfirmed')) {
          set(user, 'locationConfirmed', true);
          user.save();
        }
      });
    }
  },

  /**
   * Save the given locationId to a cookie.
   *
   * @param locationId
   */
  saveLocationIdToCookie(locationId) {
    const cookies = get(this, 'cookies');
    const windowLocation = get(this, 'windowLocation');

    cookies.write('locationId', locationId, {
      path: '/',
      secure: windowLocation.protocol() === 'https',
      expires: moment().add(5, 'years').toDate()
    });

    set(this, '_cookieLocationId', locationId);
  },

  clearLocationCookie() {
    get(this, 'cookies').clear('locationId');
    get(this, 'cookies').clear('locationConfirmed');
    set(this, '_cookieLocationId', null);
  },

  /**
   * Load the Location ID from a cookie.
   */
  loadLocationIdFromCookie() {
    const cookies = get(this, 'cookies');
    const locationId = cookies.read('locationId');
    const locationIsConfirmed = cookies.read('locationConfirmed') || 'false';
    set(this, '_cookieLocationId', locationId);
    set(this, '_cookieLocationIsConfirmed', (locationIsConfirmed.toString().toLowerCase() === 'true'));
  },

  /**
   * Attempt to get the Location from the user's html5 geolocation.
   */
  loadLocationFromCoords() {
    const geolocation = get(this, 'geolocation');
    const api = get(this, 'api');

    return geolocation.getCurrentPosition().then(
      ({coords}) => {
        return api.getLocationFromCoords(coords.latitude, coords.longitude)
          .then((data) => {
            return this._convertLocationData(data);
          });
      }).catch(() => {
        /* uncaught, this messes with acceptance tests  */
      }
    );
  },

  /**
   * Try locating the user by either geolocation or IP
   */
  locateUser() {
    return new RSVP.Promise((resolve) => {
      this.loadLocationFromCoords().then((location) => {
        if(isPresent(location)) {
          this.saveSelectedLocationId(get(location, 'id'));

          resolve(location);
        }
      });
    });
  },

  /**
   * Returns an ordered array of model parameters based on the current route
   * with the current location, if present, replaced by the given location.
   *
   * @param locationId {Location}
   * @returns {Array}
   */
  getModelsForLocationLink(locationId) {
    if (get(this, 'isLocationRouteActive')) {
      // Clone the current route params and update the location
      const models = assign({}, get(this, 'currentRouteParams'));
      models.location = {id: locationId};

      return get(this, 'history').extractOrderedParams(models);
    } else {
      return [locationId];
    }
  },

  init() {
    this._super(...arguments);
    this.loadLocationIdFromCookie();

    if(get(this, 'session.isAuthenticated')) {
      const currentUser = get(this, 'session.currentUser');
      if(currentUser && currentUser.then) {
        currentUser.then(()=>{
          if(!get(this, 'isDestroying')) {
            this._syncUserAndCookieData();
          }
        });
      }
    } else {
      this._bindSessionAuthenticatedToSyncWithUser();
    }
  },

  /*##  Private ##*/
  _bindSessionAuthenticatedToSyncWithUser() {
    get(this, 'session').on('authenticationSucceeded', ()=>{
      const currentUser = get(this, 'session.currentUser');
      if(currentUser && currentUser.then) {
        currentUser.then(()=>{
          if(!get(this, 'isDestroying')) {
            this._syncUserAndCookieData();
          }
        });
      }
    });
  },

  _syncUserAndCookieData() {
    const userLocationId = get(this, '_userLocationId');
    const userLocationIsConfirmed = get(this, '_userLocationIsConfirmed');
    const cookieLocationId = get(this, '_cookieLocationId');
    const cookieLocationIsConfirmed = get(this, '_cookieLocationIsConfirmed');
    const isSignedIn = get(this, 'session.isAuthenticated');

    if(isSignedIn) {
      if(userLocationIsConfirmed) {
        if(userLocationId && cookieLocationId !== userLocationId) {
          this.saveSelectedLocationId(userLocationId);
        }
      }

      // Has cookie confirmed location, but not user location confirmed
      if(!userLocationIsConfirmed && cookieLocationIsConfirmed) {
        this.saveCurrentUserLocationConfirmed();
      }
    }
  },

  /**
   * Convert location data into a record.
   *
   * @param locationData
   * @private
   */
  _convertLocationData(locationData) {
    if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
      const locationId = get(locationData, 'location.id');
      const store = get(this, 'store');
      let location = store.peekRecord('location', locationId);

      // Only push the locationData into the data store if it does not already exist
      if (isBlank(location)) {
        store.pushPayload('location', locationData);
        location = store.peekRecord('location', locationId);
      }

      return location;
    }
  }
});
