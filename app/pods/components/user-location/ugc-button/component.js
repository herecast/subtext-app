import { alias, and } from '@ember/object/computed';
import { debounce, next } from '@ember/runloop';
import { computed, set, setProperties, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'UserLocation-UgcButton',
  classNameBindings: ['wantsToChangeContentLocation:input-visible', 'showDropdown:open'],

  store: service(),
  userLocation: service(),

  model: null,
  wantsToChangeContentLocation: false,
  findingLocation: false,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  showDropdown: and('wantsToChangeContentLocation', 'hasInputValue'),

  _initialLocation: null,
  _chosenLocation: null,

  init() {
    this._super(...arguments);
    this._clearInput();
    this._setInitialLocation();
  },

  modelLocationName: alias('model.location.name'),

  _clearInput() {
    setProperties(this, {
      locationMatches: [],
      inputValue: null,
      wantsToChangeContentLocation: false
    })
  },

  _setInitialLocation() {
    this._startFindingLocation();

    if (get(this, 'model.isNew') && isBlank(get(this, 'model.location.name'))) {
      get(this, 'userLocation.userLocation')
      .then((userLocation) => {
        if (!get(this, 'isDestroyed')) {
          set(this, '_initialLocation', userLocation);

          this._setModelLocation(userLocation);
        }
      })
      .finally(() => {
        this._endFindingLocation();
      });
    } else {
      get(this, 'model.location')
      .then((modelLocation) => {
        if (!get(this, 'isDestroyed')) {
          set(this, '_initialLocation', modelLocation);
        }
      })
      .finally(() => {
        this._endFindingLocation();
      });
    }
  },

  _startFindingLocation() {
    if (!get(this, 'isDestroyed')) {
      set(this, 'findingLocation', true);
    }
  },

  _endFindingLocation() {
    if (!get(this, 'isDestroyed')) {
      set(this, 'findingLocation', false);
    }
  },

  _setModelLocation(contentLocation) {
    const model = get(this, 'model');
    const contentLocationId = get(contentLocation, 'id') || get(this, 'userLocation.activeUserLocationId');
    const storeLocation = get(this, 'store').peekRecord('location', contentLocationId);

    if (isPresent(storeLocation) && model) {
      set(model, 'location', storeLocation);
    } else {
      get(this, 'store').findRecord('location', contentLocationId)
      .then((locationModel) => {
        if (!get(this, 'isDestroyed')) {
          set(model, 'location', locationModel);
        }
      });
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

  buttonText: computed('_initialLocation', '_chosenLocation', function() {
    const chosenLocation = get(this, '_chosenLocation');
    let buttonLocation;

    if (isPresent(chosenLocation)) {
      buttonLocation = chosenLocation;
    } else {
      buttonLocation = get(this, '_initialLocation');
    }

    return `${get(buttonLocation, 'city')}, ${get(buttonLocation, 'state')}`;
  }),

  actions: {
    toggleWantsToChangeContentLocation() {
      this.toggleProperty('wantsToChangeContentLocation');
      if (get(this, 'wantsToChangeContentLocation')) {
        next(() => {
          $(get(this, 'element')).find('input#new-location').focus();
        });
      }
    },

    changeContentLocation(contentLocation) {
      this._setModelLocation(contentLocation);

      set(this, '_chosenLocation', contentLocation);

      this._clearInput();

      if (get(this, 'onChangeContentLocation')) {
        get(this, 'onChangeContentLocation')(contentLocation);
      }
    },

    valueChanging() {
      debounce(this, '_checkLocationMatches', 200);
    },
  }
});
