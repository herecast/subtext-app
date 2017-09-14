import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Route.extend({
  userLocation: inject.service(),
  
  model(params) {
    const currentUserLocation = get(this, 'userLocation.selectedLocationId');
    const slug = currentUserLocation || 'hartford-vt';
    let url;

    if (params.eventInstanceId) {
    	url = `/${slug}/${params.id}?eventInstanceId=${params.eventInstanceId}`;
    } else {
    	url = `/${slug}/${params.id}`;
    }

    this.transitionTo(url);
  }
});
