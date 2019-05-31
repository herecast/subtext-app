import { readOnly, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, setProperties, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  classNames: 'UserLocation-SearchInput',

  api: service(),
  geolocation: service(),
  userLocation: service(),
  userLocationName: readOnly('userLocation.userLocation.name'),
  isLoadingLocation: readOnly('userLocation.isLoadingLocation'),

  modelLocationName: null,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  gettingGeolocation: false,
  gettingMatches: false,
  shouldShowResults: false,
  hideLocateMe: false,


  init() {
    this._super(...arguments);
    setProperties(this, {
      locationMatches: []
    });
  },

  hasLocationMatches: notEmpty('locationMatches'),

  inputDisplayValue: computed('inputValue', 'userLocationName', 'shouldShowResults', function() {
    const inputValue = get(this, 'inputValue');
    const shouldShowResults = get(this, 'shouldShowResults');

    if (shouldShowResults) {
      return inputValue;
    }

    return get(this, 'userLocationName');
  }),

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
    valueChanging(value) {
      set(this, 'inputValue', value);
      run.debounce(this, '_checkLocationMatches', 200);
    },

    chooseLocation(userLocation) {
      if (get(this, 'onChangeLocation')) {
        get(this, 'onChangeLocation')(userLocation);
      } else {
        get(this, 'userLocation').saveUserLocation(userLocation);
      }
    },

    locateUser() {
      set(this, 'gettingGeolocation', true);

      get(this, 'userLocation').locateUser()
      .then((userLocation) => {
        get(this, 'userLocation').saveUserLocation(userLocation);
      })
      .finally(() => {
        set(this, 'gettingGeolocation', false);
      });
    },

    showResults() {
      set(this, 'shouldShowResults', true);
    },

    hideResults() {
      setProperties(this, {
        'shouldShowResults': false,
        'locationMatches': [],
        'inputValue': null
      });
    }
  }
});
