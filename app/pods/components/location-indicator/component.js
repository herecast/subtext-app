import Ember from 'ember';

const {get, inject, computed, isPresent} = Ember;

export default Ember.Component.extend({
  classNames: ['LocationIndicator'],

  fastboot: inject.service(),
  modals: inject.service(),
  userLocation: inject.service(),

  location: computed.oneWay('userLocation.location'),

  markers: computed('location.name', function () {
    const locationName = get(this, 'location.name');
    return isPresent(locationName) ? [locationName] : null;
  }),

  click(e) {
    e.preventDefault();
    this.openLocationMenu();
  },

  openLocationMenu() {
    get(this, 'modals').showModal('modals/location-menu');
  }
});
