import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default Component.extend({
  classNames: 'UserLocation-UgcButton',

  store: service(),
  userLocation: service(),

  model: null,
  wantsToChangeContentLocation: false,
  findingLocation: false,

  _initialLocation: null,
  _chosenLocation: null,

  init() {
    this._super(...arguments);
    this._setInitialLocation();
  },

  modelLocationName: alias('model.location.name'),

  _setInitialLocation() {
    this._startFindingLocation();

    if (get(this, 'model.isNew')) {
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
    },

    changeContentLocation(contentLocation) {
      this._setModelLocation(contentLocation);

      set(this, '_chosenLocation', contentLocation);

      if (get(this, 'onChangeContentLocation')) {
        get(this, 'onChangeContentLocation')(contentLocation);
      }
    }
  }
});
