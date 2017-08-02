import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  locations: [],
  radius: 10,
  selectedLocation: null,

  /**
   * Locations are displayed sorted by name.
   */
  sortedLocations: computed.sort('locations', 'locationsSorting'),
  locationsSorting: ['name:asc'],
});
