import { get, set } from '@ember/object';
import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import $ from 'jquery';
/* global google*/

export default Service.extend({
  fastboot: service(),

  googleMapsInit: null,
  googleMaps: null,

  getGoogleMaps() {
    if(!get(this, 'fastboot.isFastBoot')) {
      if (get(this, 'googleMaps')) {
        return Promise.resolve(get(this, 'googleMaps'));
      } else {
        return this._loadGoogleMaps();
      }
    }
  },

  _loadGoogleMaps() {
    if (this.googleMapsInit) { return this.googleMapsInit; }

    const thisService = this;

    this.googleMapsInit = new Promise((resolve) => {
      const gmapsToken = 'AIzaSyDWBIKBKlreVCqE1CqQRDQ3QQI3gx85ikw'; // reinstate with heroku env || config.GMAPS_API_TOKEN;
      $.getScript(`https://maps.googleapis.com/maps/api/js?key=${gmapsToken}`, function() {
        set(thisService, 'googleMaps', google.maps);
        resolve(google.maps);
      });
    });

    return this.googleMapsInit;
  },

  geocode() {
    let Geocoder;

    if (!get(this, 'googleMaps')) {
      return this._loadGoogleMaps().then((googleMaps) => {
        Geocoder = new googleMaps.Geocoder();
        return Geocoder.geocode(...arguments);
      });
    } else {
      const googleMaps = get(this, 'googleMaps');
      Geocoder = new googleMaps.Geocoder();
      return Geocoder.geocode(...arguments);
    }
  },

  boundingBox(location, distance) {
    const lat = location.lat || location.get('lat');
    const lng = location.lng || location.get('lng');
    const mi_per_deg = 1.1132 / 1609.34 ;//miles per degree
    const deg = distance * mi_per_deg;
    const googleMaps = get(this, 'googleMaps');

    return new googleMaps.LatLngBounds({
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
      if (c.types.includes('locality')) {
        city = c.short_name;
      }
      if (c.types.includes('administrative_area_level_1')) {
        state = c.short_name;
      }
    });
    return `${city}, ${state}`;
  }
});
