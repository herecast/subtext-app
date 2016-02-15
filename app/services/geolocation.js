import Ember from 'ember';

const { RSVP, get, set } = Ember;

export default Ember.Service.extend({
  mapsService: Ember.inject.service('google-maps'),
  userLocation: null,

  init() {
    const locationProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    set(this, 'userLocation', locationProxy.create({
      promise: this.getUserLocation()
    }));
  },

  getUserLocation() {
    return new RSVP.Promise((resolve) => {
      this.getCurrentPosition().then((position) => {
        const mapsService = get(this, 'mapsService');
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        mapsService.geocode({location: coords}, (results) =>{
          resolve({
            coords: coords,
            human: mapsService.cityStateFormat(results[0])
          });
        });
      });
    });
  },

  getCurrentPosition() {
    return new RSVP.Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(position);
      }, error => {
        reject(error);
      });
    });
  }

});
