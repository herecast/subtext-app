/* global google */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['EventShow-map'],

  setupMap: function() {
    const latitude = this.get('latitude');
    const longitude = this.get('longitude');
    const title = this.get('title');
    const latLng = new google.maps.LatLng(latitude, longitude);
    const mapEl = this.$('.EventShow-mapContent')[0];

    const mapOptions = {
      zoom: 15,
      center: latLng
    };

    if (mapEl) {
      const map = new google.maps.Map(mapEl, mapOptions);

      new google.maps.Marker({
        position: latLng,
        map: map,
        title: title
      });
    }
  }.on('didInsertElement')
});

