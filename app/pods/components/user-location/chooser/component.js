import Ember from 'ember';

const { get, set, computed, inject:{service}, run } = Ember;

export default Ember.Component.extend({
  api: service(),
  geolocation: service(),
  userLocation: service(),
  userLocationName: computed.readOnly('userLocation.userLocation.name'),

  modelLocationName: null,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  gettingGeolocation: false,
  gettingMatches: false,
  locationMatches: [],

  hideLocateMe: false,

  init() {
    this._super(...arguments);
    if (Ember.testing) {
      set(this, 'isTesting', true);
    }
  },

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
        get(this, 'userLocation').saveUserLocationFromId(userLocation.id);
      }

      closeModal();
    },

    locateUser(closeModal) {
      set(this, 'gettingGeolocation', true);

      get(this, 'userLocation').locateUser()
      .then((userLocation) => {
        get(this, 'userLocation').saveUserLocationFromId(userLocation.location.id);

        closeModal();
      })
      .finally(() => {
        set(this, 'gettingGeolocation', false);
      });
    }
  }
});
