import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Route.extend({
  userLocationService: inject.service('user-location'),

  model(params) {
    return this.store.findRecord('location', params.id);
  },

  afterModel(location) {
    get(this, 'userLocationService').setActiveLocationId(get(location, 'id'));
  }
});
