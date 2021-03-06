import { computed, set, get, setProperties } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { debounce, later } from '@ember/runloop';
import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend( {
  classNames: ['FirstVisit'],

  fastboot: service(),
  modals: service(),
  router: service(),
  session: service(),
  userLocation: service(),

  gettingMatches: false,
  chosenLocation: null,
  showAnimation: false,

  inputValue: null,
  minInputValueLength: 3,
  hasInputValue: computed('inputValue', function() {
    return parseInt(get(this, 'inputValue.length')) > parseInt(get(this, 'minInputValueLength'));
  }),

  init() {
    this._super(...arguments);
    setProperties(this, {
      locationMatches: []
    });
  },

  currentUserLocation: readOnly('userLocation.userLocation'),

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
    valueChanging() {
      debounce(this, '_checkLocationMatches', 200);
    },

    chooseLocation(chosenLocation) {
      if (isPresent(get(chosenLocation, 'id'))) {
        set(this, 'chosenLocation', chosenLocation);
        later(() => {
          get(this, 'userLocation').trigger('userHasChosenWelcomeLocation');
        }, 200);
      }
    },

    focusOnInput() {
      $(this.element).find('#first-location').focus();
    },

    transferToFeed() {
      later(() => {
        get(this, 'userLocation').goToLocationFeed(get(this, 'chosenLocation'));
      }, 200);
    },

    openSignin() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },

    goToHomeFeed() {
      get(this, 'router').transitionTo('feed');
    }
  }
});
