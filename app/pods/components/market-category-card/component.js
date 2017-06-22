import Ember from 'ember';

const { inject, computed } = Ember;

export default Ember.Component.extend({
  userLocation: inject.service(),
  locationId: computed.oneWay('userLocation.locationId'),
});
