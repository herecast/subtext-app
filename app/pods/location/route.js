import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Route.extend({
  userLocation: inject.service(),

  model(params) {
    return this.store.findRecord('location', params.id).catch(() => {
      // We have a bad location in the URL. Clear it out and start over.
      const userLocation = get(this, 'userLocation');
      userLocation.setActiveLocationId(null);
      userLocation.clearLocationCookie();

      this.transitionTo('index');
    });
  },

  afterModel(location) {
    get(this, 'userLocation').setActiveLocationId(get(location, 'id'));
  }
});
