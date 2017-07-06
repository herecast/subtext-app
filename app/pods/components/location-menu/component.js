import Ember from 'ember';
import {chunk} from 'lodash';

const {get, set, computed, inject, isPresent, getWithDefault} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'location-menu',
  classNames: ['LocationMenu'],
  userLocation: inject.service(),
  media: inject.service(),
  routing: inject.service('-routing'),
  history: inject.service(),
  fastboot: inject.service(),

  currentRouteName: computed.oneWay('history.currentRouteName'),

  /**
   * List of `Location` objects.
   * @required
   */
  locations: [],

  /**
   * Locations are displayed sorted by name.
   */
  sortedLocations: computed.sort('visibleLocations', 'locationsSorting'),
  locationsSorting: ['name:asc'],

  /**
   * Returns the list of locations which are currently visible,
   * depending on which state is selected, or all locations if the device is Fastboot or on mobile
   */
  visibleLocations: computed('locations.@each.state', 'selectedState', 'showAllLocations', function () {
    const locations = get(this, 'locations');
    if (locations) {
      const showAllLocations = get(this, 'showAllLocations');
      if (showAllLocations) {
        return locations;
      } else {
        const selectedState = get(this, 'selectedState');
        return locations.filter(location => getWithDefault(location, 'state', "").toUpperCase() === selectedState);
      }
    } else {
      return [];
    }
  }),

  /**
   * Show all locations for fastboot (helps with SEO), and on mobile (since state tabs are suppressed)
   */
  showAllLocations: computed('fastboot.isFastBoot', 'media.isMobile', function() {
    const isFastBoot = get(this, 'fastboot.isFastBoot');
    const isMobile = get(this, 'media.isMobile');

    return isFastBoot || isMobile;
  }),

  /**
   * The tab for the state of the selected location will be active, otherwise we default to VT.
   */
  selectedState: computed('userLocation.location.state', function () {
    const selectedState = get(this, 'userLocation.location.state');
    return isPresent(selectedState) ? selectedState.toUpperCase() : 'VT';
  }),

  /**
   * Returns a sorted, unique list of each state for which we have locations
   */
  states: computed('locations.@each.state', function () {
    const locations = get(this, 'locations');

    if (isPresent(locations)) {
      return locations
        .map(item => getWithDefault(item, 'state', "").toUpperCase())
        .uniq()
        .sort();
    } else {
      return [];
    }
  }),

  /**
   * Returns a list of route data to render the list of location links.
   */
  locationLinks: computed('sortedLocations.[]', function () {
    const locationLinkRoute = get(this, 'locationLinkRoute');
    const userLocation = get(this, 'userLocation');

    return get(this, 'sortedLocations').map((location) => {
      return {
        location,
        model: userLocation.getModelsForLocationLink(get(location, 'id')),
        route: locationLinkRoute
      };
    });
  }),

  /**
   * The location links will always point to a location route,
   * - using the channel if it was set on the component.
   * - otherwise it uses the current route if it is a location route
   * - else we point to the location's homepage.
   */
  locationLinkRoute: computed('channel', 'userLocation.isLocationRouteActive', function () {
    const channel = get(this, 'channel');
    if (isPresent(channel)) {
      return `location.${channel}`;
    }

    if (get(this, 'userLocation.isLocationRouteActive')) {
      return get(this, 'currentRouteName');
    }

    return 'location.index';
  }),

  /**
   * The locations are divided into columns depending on the size of the viewport
   */
  groupedLocations: computed('locationLinks.[]', 'media.isMobile', 'media.isTablet', function () {
    const locationLinks = get(this, 'locationLinks');
    let columns;

    if (get(this, 'media.isMobile')) {
      columns = 2;
    } else if (get(this, 'media.isTablet')) {
      columns = 3;
    } else {
      columns = 4;
    }

    return chunk(locationLinks, Math.ceil(locationLinks.length / columns));
  }),

  actions: {
    navigateToLocation(locationLink) {
      const userLocation = get(this, 'userLocation');
      const router = get(this, 'routing.router');

      userLocation.saveSelectedLocationId(get(locationLink, 'location.id'));
      router.transitionTo(locationLink.route, ...locationLink.model);
    },
    chooseStateTab(stateName) {
      set(this, 'selectedState', stateName);
    },
    locateMe() {
      const userLocation = get(this, 'userLocation');

      return userLocation.loadLocationFromCoords().then(location => {
        if (!get(this, 'isDestroyed')) {
          const router = get(this, 'routing.router');
          const route = get(this, 'locationLinkRoute');
          const models = userLocation.getModelsForLocationLink(get(location, 'id'));

          userLocation.saveSelectedLocationId(get(location, 'id'));

          router.transitionTo(route, ...models);
        }
      });
    }
  }
});
