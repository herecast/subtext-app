import Ember from 'ember';

const {get, set, inject, computed, isPresent} = Ember;

/**
 * Child class of LinkComponent to automatically prepend 'location.' in front of the given
 * route name when a `locationId` is present in the `user-location` service.
 *
 * For example, `{{#location-link 'news'}}News{{/location-link}}` will link to `location.news` if we have a location,
 * otherwise it would link to just `news`. Note that this means BOTH routes must exist.
 *
 * This is mostly useful for linking to index/channel routes, where if the user goes to the non-location version of the route,
 * (such as `news` instead of `location.news`) we use the `location-index` mixin so the base route will redirect
 * to the location version of that route, or render a list of locations for the user to make a selection
 */
export default Ember.LinkComponent.extend({
  userLocation: inject.service(),
  locationId: computed.readOnly('userLocation.locationId'),

  _originalTargetRouteName: null,
  _originalModels: [],
  _originalCurrentWhen: null,

  targetRouteName: computed('_originalTargetRouteName', 'locationId', {
    get() {
      return this._computeTargetRouteName();
    },
    set(key, targetRouteName) {
      set(this, '_originalTargetRouteName', targetRouteName);
      return this._computeTargetRouteName();
    }
  }),

  models: computed('_originalModels.[]', 'locationId', {
    get() {
      return this._computeModels();
    },
    set(key, value) {
      set(this, '_originalModels', value);
      return this._computeModels();
    }
  }),

  'current-when': computed('_originalCurrentWhen', 'locationId', {
    get() {
      return this._computeCurrentWhen();
    },
    set(key, value) {
      set(this, '_originalCurrentWhen', value);
      return this._computeCurrentWhen();
    }
  }),

  _computeTargetRouteName() {
    const route = get(this, '_originalTargetRouteName');
    const locationId = get(this, 'locationId');

    return locationId ? `location.${route}` : route;
  },

  _computeModels() {
    const locationId = get(this, 'locationId');
    let models = get(this, '_originalModels') || [];

    if (locationId) {
      // Copy the array and prepend the location to it.
      models = models.slice();
      models.unshift(locationId);
    }

    return models;
  },

  _computeCurrentWhen() {
    const currentWhen = get(this, '_originalCurrentWhen');
    if (isPresent(currentWhen)) {
      const locationId = get(this, 'locationId');
      return locationId ? `location.${currentWhen}` : currentWhen;
    } else {
      return get(this, 'targetRouteName');
    }
  },

});
