import Ember from 'ember';

const {get, set, computed, inject, isPresent, getWithDefault} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'location-menu',
  classNames: ['LocationMenu'],
  userLocation: inject.service(),
  tracking: inject.service(),
  media: inject.service(),
  routing: inject.service('-routing'),
  history: inject.service(),
  fastboot: inject.service(),

  currentRouteName: computed.oneWay('history.currentRouteName'),
  currentLocation: computed.oneWay('userLocation.location'),

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

  actions: {
    chooseLocation(location) {
      const onChooseLocation = get(this, 'onChooseLocation');
      if (onChooseLocation) {
        onChooseLocation(location);
      }
    },
    chooseStateTab(stateName) {
      set(this, 'selectedState', stateName);
    },
    locateMe() {
      const userLocation = get(this, 'userLocation');

      get(this, 'tracking').push({
        event: "click-locate-me"
      });

      return userLocation.loadLocationFromCoords().then(location => {
        if (!get(this, 'isDestroyed')) {
          get(this, 'tracking').push({
            event: 'user-located',
            new_location_id: get(location, 'id'),
            new_location_name: get(location, 'name')
          });
          const onChooseLocation = get(this, 'onChooseLocation');
          if (onChooseLocation) {
            onChooseLocation(location);
          }
        }
      });
    }
  }
});
