import Ember from 'ember';

const { RSVP, get, computed, inject:{service} } = Ember;

export default Ember.Service.extend({
  mapsService: service('google-maps'),
  defaultLocation: {
    human: 'Hartford, VT',
    coords: {
      lat: 43.663,
      lng: -72.369
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
      this.getCurrentPosition()
      .then((position) => {
        if(!get(this, 'isDestroying')) {
          const mapsService = get(this, 'mapsService');
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          mapsService.geocode({location: coords}, (results) => {
            if(!get(this, 'isDestroying')) {
              const loc = {
                coords: coords,
                human: mapsService.cityStateFormat(results[0])
              };
              resolve(loc);
            }
          });
        }
      })
      .catch(() => {
        if (!get(this, 'isDestroying')) {
          return resolve(get(this, 'defaultLocation'));
        }
      });
    });
  },

  getCurrentPosition() {
    return new RSVP.Promise((resolve, reject) => {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(position => {
          if(!get(this, 'isDestroying')) {
            resolve(position);
          }
        }, error => {
          if(!get(this, 'isDestroying')) {
            reject(error);
          }
        }, options);
      } else {
        reject();
      }
    });
  },

  geocode(address, filterParams) {
    const mapsService = get(this, 'mapsService');
    const returnSet = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
    const userLocation = get(this, 'userLocation');

    return returnSet.create({
      promise: new Ember.RSVP.Promise(function(resolve, reject) {
        var geoArgs = {
          address: address,
          componentRestrictions: {
            country: 'US'
          }
        };
        // Create a bias to 25 bounding box from user location
        if(userLocation.get('isSettled')) {
          geoArgs['bounds'] = mapsService.boundingBox(userLocation.get('coords'), 25);
        }

        mapsService.geocode(geoArgs, function(results, status) {
          if(status !== "OK") {
            reject(status);
          } else {
            resolve(results.filter(item => {
              const isLocality = item.types.includes('locality');

              if (isLocality && filterParams) {
                const {filterType, filterArray} = filterParams;
                const filterMatch = item.address_components.find(address_component => {
                  return address_component.types.includes(filterType);
                });

                return filterArray.any(filterItem => {
                  const pattern = new RegExp(filterMatch.short_name, 'i');
                  return filterItem.match(pattern);
                });
              } else {
                return isLocality;
              }
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
