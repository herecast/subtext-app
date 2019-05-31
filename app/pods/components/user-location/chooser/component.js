import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  api: service(),
  geolocation: service(),
  userLocation: service(),
  userLocationName: readOnly('userLocation.userLocation.name'),

  modelLocationName: null,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  gettingGeolocation: false,
  gettingMatches: false,
  hideLocateMe: false,

  init() {
    this._super(...arguments);
    setProperties(this, {
      locationMatches: []
    });
  },

  _checkLocationMatches() {
    if (get(this, 'hasInputValue')) {
      const inputValue = get(this, 'inputValue');

      set(this, 'gettingMatches', true);

      get(this, 'userLocation').checkLocationMatches(inputValue)
      .then((locationMatches) => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'locationMatches', locationMatches);
        }
      })
      .finally(() => {
        set(this, 'gettingMatches', false);
      });
    } else {
      set(this, 'locationMatches', []);
    }
  },

  actions: {
    afterSlideClose() {
      if (get(this, 'onClose')) {
        get(this, 'onClose')();
      }
    },

    focusOnInput() {
      this.$('input').focus();
    },

    valueChanging() {
      run.debounce(this, '_checkLocationMatches', 200);
    },

    chooseLocation(userLocation, closeModal) {
      if (get(this, 'onChangeLocation')) {
        get(this, 'onChangeLocation')(userLocation);
      } else {
        get(this, 'userLocation').saveUserLocation(userLocation);
      }

      closeModal();
    },

    locateUser(closeModal) {
      set(this, 'gettingGeolocation', true);

      get(this, 'userLocation').locateUser()
      .then((userLocation) => {
        get(this, 'userLocation').saveUserLocation(userLocation);

        closeModal();
      })
      .finally(() => {
        set(this, 'gettingGeolocation', false);
      });
    }
  }
});
