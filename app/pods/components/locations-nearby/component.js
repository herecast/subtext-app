import Ember from 'ember';

const {get, inject, computed} = Ember;

export default Ember.Component.extend({
  modals: inject.service(),

  radius: 10,
  location: null,
  nearbyLocations: [],

  /**
   * Number of nearest towns excluding the current one
   */
  nearestTowns: computed('nearbyLocations', function() {
    const nearbyLocationsLength = get(this, 'nearbyLocations.length');
    return (nearbyLocationsLength) ? nearbyLocationsLength - 1 : 0;
  }),

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
