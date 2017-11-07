import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Route.extend({
  userLocation: inject.service('user-location'),

  redirect() {
    const locationId = get(this, 'userLocation.selectedOrDefaultLocationId');
    this.replaceWith('feed', {
      queryParams: {
        location: locationId
      }
    });
  }
});
