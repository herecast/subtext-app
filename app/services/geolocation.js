import Ember from 'ember';

const { RSVP, get, computed } = Ember;

export default Ember.Service.extend({
  mapsService: Ember.inject.service('google-maps'),

  userLocation: computed('mapsService', function() {
    const locationProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    return locationProxy.create({
      promise: this.getUserLocation()
    });
  }),

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
  },

  geocode(address) {
    const mapsService = get(this, 'mapsService');
    const returnSet = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

    return returnSet.create({
      promise: new Ember.RSVP.Promise(function(resolve, reject) {
        mapsService.geocode({
          address: address,
          componentRestrictions: {
            country: 'US'
          }
        }, function(results, status) {
          if(status !== "OK") {
            reject(status);
          } else {
            resolve(results.map(item => {
              return {
                human: mapsService.cityStateFormat(item),
                coords: {
                  lat: item.geometry.location.lat(),
                  lng: item.geometry.location.lng()
                }
              };
            }));
          }
        });
      })
    });
  }

});
