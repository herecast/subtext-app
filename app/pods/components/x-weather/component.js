import Ember from 'ember';

const { set, get, inject } = Ember;

export default Ember.Component.extend({
  api: inject.service('api'),
  classNames: ['Weather'],

  init() {
    this._super(...arguments);

    this._getWeather();
  },

  _getWeather() {
    const api = get(this, 'api');

    api.getWeather().then((response) => {
      if (!get(this, 'isDestroyed')) {
        set(this, 'weatherHTML', response);
      }
    });
  },

  didUpdateAttrs(attrs) {
    this._super(...arguments);

    // When the user's location changes, reload the weather so that we are
    // always showing the weather for their current location.
    if (attrs.oldAttrs.location !== attrs.newAttrs.location) {
      this._getWeather();
    }
  }
});
