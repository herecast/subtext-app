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

  boundingBox(location, distance) {
    const lat = location.lat || location.get('lat');
    const lng = location.lng || location.get('lng');
    const mi_per_deg = 1.1132 / 1609.34 ;//miles per degree
    const deg = distance * mi_per_deg;

    return new this.googleMaps.maps.LatLngBounds({
      lat: lat - deg,
      lng: lng - deg
    },{
      lat: lat + deg,
      lng: lng + deg
    });
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
