import Ember from 'ember';

const {get, set, computed, inject, isPresent} = Ember;

export default Ember.Component.extend({
  userLocation: inject.service(),
  store: inject.service(),

  location: computed.oneWay('userLocation.location'),
  radius: 10,
  nearbyLocations: [],

  onChooseRadius: null,
  onChooseLocation: null,
  onNearbyLocationsChanged: null,

  _updateNearbyLocations() {
    const locationId = get(this, 'location.id');

    if (isPresent(locationId)) {
      get(this, 'store').query('location', {near: locationId, radius: get(this, 'radius')}).then(locations => {
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
    chooseRadius(radius) {
      set(this, 'radius', radius);
      const onChooseRadius = get(this, 'onChooseRadius');
      if (onChooseRadius) {
        onChooseRadius(radius);
      }
    },
    chooseLocation(location) {
      set(this, 'location', location);
      const onChooseLocation = get(this, 'onChooseLocation');
      if (onChooseLocation) {
        onChooseLocation(location);
      }
    },
  }
});
