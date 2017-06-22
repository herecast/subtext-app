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
  cookies: inject.service(),
  geolocation: inject.service(),
  session: inject.service(),
  store: inject.service(),
  api: inject.service(),
  windowLocation: inject.service('window-location'),
  history: inject.service(),
  fastboot: inject.service(),

  currentRouteName: computed.oneWay('history.currentRouteName'),
  currentRouteParams: computed.oneWay('history.currentRoute.params'),

  // Location loaded from cookie
  _cookieLocationId: null,

  // Location loaded from user
  _userLocationId: computed.alias('session.currentUser.locationId'),

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
  selectedLocationId: computed('_userLocationId', '_cookieLocationId', function() {
    const _cookieLocationId = get(this, '_cookieLocationId');
    const _userLocationId = get(this, '_userLocationId');

    return _userLocationId || _cookieLocationId || null;
  }),

  selectedLocation: computed('selectedLocationId', function() {
    const promise = new RSVP.Promise((resolve, reject) => {
      const selectedLocationId = get(this, 'selectedLocationId');

      if (isPresent(selectedLocationId)) {
        get(this, 'store').findRecord('location', selectedLocationId)
          .then(resolve)
          .catch(() => {
            // Clear the cookie in case the user has a bad value set.
            this._clearLocationCookie();
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
          resolve(null);
        }
      }
    });

    return ObjectPromiseProxy.create({promise});
  }),

  /**
   * This is the default Location ID to use, such as when constructing
   * routes in the location-link component. If the user has an 'active' location,
   * that one will take precedence over a previously selected location id.
   */
  locationId: computed.readOnly('location.id'),
  location: computed('activeLocationId', 'selectedLocationId', function() {
    return ObjectPromiseProxy.create({
      promise: isPresent(get(this, 'activeLocationId')) ? get(this, 'activeLocation') : get(this, 'selectedLocation')
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
    set(this, 'activeLocationId', locationId);

    this.trigger('locationDidChange');

    const cookieLocationId = get(this, '_cookieLocationId');
    if (isBlank(cookieLocationId)) {
      this.saveLocationIdToCookie(locationId);
    }
  },

  /**
   * Save the given locationId to a cookie and to the current user if they're logged in.
   *
   * @param locationId
   */
  saveSelectedLocationId(locationId) {
    if (get(this, 'session.isAuthenticated')) {
      const currentUser = get(this, 'session.currentUser');

      if (currentUser) {
        currentUser.then((user) => {
          set(user, 'locationId', locationId);
          user.save();
        });
      }
    }

    this.saveLocationIdToCookie(locationId);
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

  _clearLocationCookie() {
    get(this, 'cookies').clear('locationId');
    set(this, '_cookieLocationId', null);
  },

  /**
   * Load the Location ID from a cookie.
   */
  loadLocationIdFromCookie() {
    const cookies = get(this, 'cookies');
    const locationId = cookies.read('locationId');
    set(this, '_cookieLocationId', locationId);
  },

  /**
   * Attempt to get the Location from the user's html5 geolocation.
   */
  loadLocationFromCoords() {
    const geolocation = get(this, 'geolocation');
    const api = get(this, 'api');

    return geolocation.getCurrentPosition().then(
      ({coords}) => {
        return api.getLocationFromCoords(coords.latitude, coords.longitude).then(
          (locationData) => this._saveLocationData(locationData)
        );
      }).catch(() => {
        /* uncaught, this messes with acceptance tests  */
      }
    );
  },

  /**
   * Attempt to get the Location from the user's IP address.
   */
  loadLocationFromIP() {
    const api = get(this, 'api');
    return api.getLocationFromIP().then(
      (locationData) => this._saveLocationData(locationData)
    );
  },

  /**
   * Locate the current user first by using their IP address, then by getting their geolocation.
   * We do one after the other to avoid an async race-condition.
   */
  locateUser() {
    return this.loadLocationFromIP().then(
      () => this.loadLocationFromCoords()
    );
  },

  /**
   * Save the given json object as a Location and set it as the user's selected Location.
   *
   * @param locationData
   * @private
   */
  _saveLocationData(locationData) {
    if (!get(this, 'isDestroying') && !get(this, 'isDestroyed')) {
      const locationId = get(locationData, 'location.id');
      const store = get(this, 'store');
      let location = store.peekRecord('location', locationId);

      // Only push the locationData into the data store if it does not already exist
      if (isBlank(location)) {
        store.pushPayload('location', locationData);
        location = store.peekRecord('location', locationId);
      }

      // Set the location as the selected locationId, but only after it is added to the store
      this.saveSelectedLocationId(locationId);

      return location;
    }
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
  }
});