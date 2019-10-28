import { get, set, setProperties } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'HideLocationButton',

  router: service(),
  tracking: service(),

  location: null,
  contentId: null,
  flagType: null,

  showSuccess: false,
  hasFlagType: notEmpty('flagType'),
  isInvalid: false,
  wantsToHideLocation: false,
  afterHide: null,
  afterCancel: null,
  additionToMessage: null,

  init() {
    this._super(...arguments);
    setProperties(this, {
      flagTypes: ['Not interested in this location', "I don't live in this location", 'This location is too far from me', 'I see too much in this location']
    });
  },

  _resetProperties() {
    setProperties(this, {
      isInvalid: false,
      flagType: null,
      wantsToHideLocation: false
    });
  },

  actions: {
    close() {
      this._resetProperties();

      if (get(this, 'hasHiddenLocation')) {
        if (get(this, 'afterHide')) {
          get(this, 'afterHide')();
        } else {
          get(this, 'router').transitionTo('feed');
        }
      } else {
        if (get(this, 'afterCancel')) {
          get(this, 'afterCancel')();
        }
      }
    },

    hide() {
      const flagType = get(this, 'flagType');

      if (isPresent(flagType)) {
        const location = get(this, 'location');

        get(this, 'tracking').trackHideLocation({
          contentId: get(this, 'contentId'),
          locationId: get(location, 'id'),
          locationName: get(location, 'name'),
          flagType: flagType
        });

        setProperties(this, {
          'showSuccess': true,
          'hasHiddenLocation': true
        });
      } else {
        set(this, 'isInvalid', true);
      }
    }
  }
});
