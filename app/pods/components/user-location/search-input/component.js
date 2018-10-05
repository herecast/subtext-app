import Ember from 'ember';

const { get, set, setProperties, computed, inject:{service}, run } = Ember;

export default Ember.Component.extend({
  classNames: 'UserLocation-SearchInput',

  api: service(),
  geolocation: service(),
  userLocation: service(),
  userLocationName: computed.readOnly('userLocation.userLocation.name'),
  isLoadingLocation: computed.readOnly('userLocation.isLoadingLocation'),

  modelLocationName: null,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  gettingGeolocation: false,
  gettingMatches: false,
  shouldShowResults: false,
  locationMatches: [],
  hasLocationMatches: computed.notEmpty('locationMatches'),

  inputDisplayValue: computed('inputValue', 'userLocationName', function() {
    const inputValue = get(this, 'inputValue') || false;

    if (inputValue) {
      return inputValue;
    }

    return get(this, 'userLocationName');
  }),

  hideLocateMe: false,

  _checkLocationMatches() {
    if (get(this, 'hasInputValue')) {
      const inputValue = get(this, 'inputValue');

      set(this, 'gettingMatches', true);

      get(this, 'userLocation').checkLocationMatches(inputValue)
      .then((locationMatches) => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'locationMatches', locationMatches.locations);
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
        get(this, 'userLocation').saveUserLocationFromId(userLocation.id);
      }
    },

    locateUser() {
      set(this, 'gettingGeolocation', true);

      get(this, 'userLocation').locateUser()
      .then((userLocation) => {
        get(this, 'userLocation').saveUserLocationFromId(userLocation.location.id);
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
