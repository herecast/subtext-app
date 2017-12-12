import Ember from 'ember';

const {
  get,
  set,
  isPresent,
  inject
} = Ember;

export default Ember.Mixin.create({
  userLocation: inject.service(),

  /**
   * Add a base location if none exists yet
   */
  afterModel(model) {
    this._super(...arguments);
    return get(model, 'ugcBaseLocation').then((baseLocation) => {

      if(!isPresent(baseLocation)) {
        get(this, 'userLocation.location').then((location) => {
          set(model, 'ugcBaseLocation', location);
        });
      }
    });
  }
});
