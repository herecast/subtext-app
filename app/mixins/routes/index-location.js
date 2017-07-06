import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Mixin.create({
  userLocation: inject.service('user-location'),
  session: inject.service('session'),
  fastboot: inject.service(),

  init() {
    this._super(...arguments);

    get(this, 'session').on("authenticationSucceeded", ()=>{
      this.get('session.currentUser').then(()=>{
        this.refresh();
      });
    });
  },

  model() {
    // Query so only locations returned by API are displayed.
    // Not what's currently in the store.
    return this.store.query('location', {});
  },

  redirect(model, transition) {
    const locationId = get(this, 'userLocation.selectedLocationId');

    if (locationId) {
      this.navigateToLocation(locationId, transition);
    }
  },

  navigateToLocation(locationId, transition) {
    let locationRoute = transition.targetName;

    // Normalize the location route
    if (locationRoute.endsWith('.index')) {
      locationRoute = locationRoute.substring(0, locationRoute.lastIndexOf('.index'));
    }

    this.transitionTo(`location.${locationRoute}`, locationId, {queryParams: transition.queryParams});
  },

  setupController(controller) {
    this._super(...arguments);
    controller.set('secondaryBackground', true);
  }
});
