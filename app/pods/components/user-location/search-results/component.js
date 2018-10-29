import Component from '@ember/component';
import { set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  classNames: 'UserLocation-SearchResults',
  'data-test-component': 'user-location-search-results',

  userLocation: service(),

  gettingGeolocation: false,
  results: A(),

  actions: {
    locateUser() {
      set(this, 'gettingGeolocation', true);

     get(this, 'userLocation').locateUser()
      .then((userLocation) => {
        get(this, 'userLocation').saveUserLocationFromId(userLocation.location.id);

        if (get(this, 'afterSaveLocation')) {
          get(this, 'afterSaveLocation')();
        }
      })
      .finally(() => {
        set(this, 'gettingGeolocation', false);
      });
    },

    chooseLocation(userLocation) {
      if (get(this, 'onChangeLocation')) {
        get(this, 'onChangeLocation')(userLocation);
      } else {
        get(this, 'userLocation').saveUserLocationFromId(userLocation.id);

        if (get(this, 'afterSaveLocation')) {
          get(this, 'afterSaveLocation')();
        }
      }
    }
  }

});
