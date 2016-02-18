import Ember from 'ember';

export default Ember.Service.extend({
  // googleMaps set by iniitializer
  geocoder: Ember.computed('googleMaps', function() {
    return new this.googleMaps.maps.Geocoder();
  }),

  geocode() {
    const geocoder = this.get('geocoder');
    return geocoder.geocode(...arguments);
  },

  cityStateFormat(item) {
    var city = "", 
        state = "";

    item.address_components.forEach(function(c) {
      if (c.types.contains('locality')) {
        city = c.short_name;
      }
      if (c.types.contains('administrative_area_level_1')) {
        state = c.short_name;
      }
    });
    return `${city}, ${state}`;
  }
});
