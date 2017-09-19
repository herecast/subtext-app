import Ember from 'ember';

const {
  get,
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
    const baseLocation = get(model, 'contentLocations').findBy('locationType', 'base');

    if(!isPresent(baseLocation)) {
      get(this, 'userLocation.location').then((location) => {
        get(model, 'contentLocations').addObject(
          this.store.createRecord('content-location', {
            locationType: 'base',
            locationId: location.id,
            location: location
          })
        );
      });
    }
  }
});
