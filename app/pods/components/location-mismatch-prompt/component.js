import Ember from 'ember';

const {get, inject, computed} = Ember;

export default Ember.Component.extend({
  'data-test-component': 'location-mismatch-prompt',
  userLocation: inject.service(),
  tracking: inject.service(),

  activeLocationId: computed.readOnly('userLocation.activeLocationId'),
  activeLocation: computed.readOnly('userLocation.activeLocation'),

  selectedLocationId: computed.readOnly('userLocation.selectedLocationId'),
  selectedLocation: computed.readOnly('userLocation.selectedLocation'),

  changeLocation(){}, // Closure action

  actions: {
    saveSelectedLocationId(locationId) {
      get(this, 'tracking').push({
        'VirtualComponent': 'location-mismatch-prompt',
        event: 'SaveSelectedLocation',
        selected: locationId
      });


      const userLocation = get(this, 'userLocation');
      userLocation.saveSelectedLocationId(locationId);
    },

    resetLocation(location) {
      get(this, 'tracking').push({
        'VirtualComponent': 'location-mismatch-prompt',
        event: 'SwitchLocation',
        selected: get(location, 'id')
      });
      this.send('saveSelectedLocationId', get(location, 'id'));
      this.changeLocation(location);
    },
  }
});
