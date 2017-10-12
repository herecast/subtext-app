import Ember from 'ember';

const {get, set, computed, inject, isPresent} = Ember;

export default Ember.Component.extend({
  userLocation: inject.service(),
  store: inject.service(),
  modals: inject.service(),

  radius: 10,
  location: computed.oneWay('userLocation.location'),
  isMyStuffOnly: computed('radius', function() {
    return get(this, 'radius') === 'myStuff';
  }),
  nearbyLocations: [],
  onNearbyLocationsChanged: null, // closure action for listening to changes

  /**
   * Number of nearest towns excluding the current one
   */
  nearestTowns: computed('nearbyLocations', function() {
    const nearbyLocationsLength = get(this, 'nearbyLocations.length');
    return (nearbyLocationsLength) ? nearbyLocationsLength - 1 : 0;
  }),

  _updateNearbyLocations() {
    const locationId = get(this, 'location.id');

    if (isPresent(locationId)) {
      get(this, 'store').query('location', {near: locationId, radius: get(this, 'radius') || 0}).then(locations => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'nearbyLocations', locations);
          const onNearbyLocationsChanged = get(this, 'onNearbyLocationsChanged');
          if (onNearbyLocationsChanged) {
            onNearbyLocationsChanged(locations);
          }
        }
      });
    }
  },

  didReceiveAttrs() {
    this._super();
    this._updateNearbyLocations();
  },

  actions: {
    showActiveLocations() {
      get(this, 'modals').showModal('modals/location-list', {
        locations: get(this, 'nearbyLocations'),
        selectedLocation: get(this, 'location'),
        radius: get(this, 'radius'),
      });
    }
  }
});
