import Component from '@ember/component';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import $ from 'jquery';

export default Component.extend({
  classNames: ['GoogleMap'],

  googleMapsService: service('google-maps'),
  googleMaps: null,
  googleMapInstance: null,

  centerLocation: null,

  didInsertElement() {
    this.initGoogleMap();
  },

  initGoogleMap() {
    return get(this, 'googleMapsService').getGoogleMaps()
    .then(googleMaps => {
      set(this, 'googleMaps', googleMaps);

      const $mapContainer = $(this.element).find('.GoogleMap-embed');
      const centerLocation = get(this, 'centerLocation');
      const coords = {
        lat: parseFloat(get(centerLocation, 'latitude')),
        lng: parseFloat(get(centerLocation, 'longitude'))
      };

      const googleMapInstance = new googleMaps.Map($mapContainer[0], {
        center: coords,
        mapTypeId: googleMaps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        gestureHandling: 'none',
        zoomControl: false,
        zoom: 10 });

      const marker = new googleMaps.Marker({
        title: get(centerLocation, 'name'),
        position: coords
      });

      marker.setMap(googleMapInstance);

      set(this, 'googleMapInstance', googleMapInstance);

      return Promise.resolve();
    });
  }
});
