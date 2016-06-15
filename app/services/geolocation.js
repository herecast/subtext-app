import Ember from 'ember';

const { RSVP, get, computed } = Ember;

export default Ember.Service.extend({
  mapsService: Ember.inject.service('google-maps'),
  defaultLocation: {
    human: 'Lebanon, NH',
    coords: {
      lat: 43.645,
      lng: -72.243
    }
  },

  userLocation: computed('mapsService', function() {
    const locationProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin, {
      content: get(this, 'defaultLocation')
    });

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

        /**************
        * Remove this when location allowed outside test market
        */
        const defaultLocation = get(this, 'defaultLocation');
        const distance = this.distance(defaultLocation.coords, coords) * 0.621371;
        if(distance >= 50) {
          return resolve(defaultLocation);
        }
        /****/

        mapsService.geocode({location: coords}, (results) =>{
          const loc = {
            coords: coords,
            human: mapsService.cityStateFormat(results[0])
          };
          resolve(loc);
        });
      }, () => {
          /*
          * This is for the case that the user has blocked geopositioning in the browser
          */
          return resolve(get(this, 'defaultLocation'));
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

  geocode(address, whitelist) {
    const mapsService = get(this, 'mapsService');
    const returnSet = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
    const userLocation = get(this, 'userLocation');
    const upperCaseFilters = whitelist.filters.map((value) => { return value.toUpperCase(); });

    return returnSet.create({
      promise: new Ember.RSVP.Promise(function(resolve, reject) {
        var geoArgs = {
          address: address,
          componentRestrictions: {
            country: 'US'
          }
        };

        // Create a bias to 50 bounding box from user location
        if(userLocation.get('isSettled')) {
          geoArgs['bounds'] = mapsService.boundingBox(userLocation.get('coords'), 25);
        }

        mapsService.geocode(geoArgs, function(results, status) {
          if(status !== "OK") {
            reject(status);
          } else {
            resolve(results.filter(item => {
              let keepItem = false;
              if (item.types.contains('locality') && whitelist) {
                item.address_components.forEach((address_component) => {
                  //if this is the right type of filter to check
                  if(address_component.types.contains(whitelist.type)) {
                    keepItem = upperCaseFilters.contains(address_component.short_name.toUpperCase());
                  }
                });
              } else {
                keepItem = item.types.contains('locality');
              }
              return keepItem;
            }).map(item => {
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
  },

  reverseGeocode(lat, lng) {
    const mapsService = get(this, 'mapsService');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      mapsService.geocode({
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      }, function(results, status) {
          if(status !== "OK") {
            reject(status);
          } else {
            resolve(mapsService.cityStateFormat(results[0]));
          }
      });
    });
  },

  distance(p1, p2) {
    const lat1 = p1.lat,
          lon1 = p1.lng,
          lat2 = p2.lat,
          lon2 = p2.lng;

    const R = 6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
  }

});
