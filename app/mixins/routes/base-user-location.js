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

    return get(model, 'location').then((location) => {
      if(!isPresent(location)) {
        get(this, 'userLocation.location').then((location) => {
          set(model, 'location', location);
        });
      }
    });
  }
});
