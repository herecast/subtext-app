import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, set, inject, on, computed, isPresent } = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['LocationDropdown'],
  api: inject.service('api'),
  fastboot: inject.service('fastboot'),
  isFastBoot: computed.readOnly('fastboot.isFastBoot'),
  locations: [],
  isEditing: false,

  getLocations: on('init', function() {
    const api = get(this, 'api');

    if (this.get('selectedLocationId') || this.get('isEditing')) {
      const promise = api.getLocations().then(response => {
        this.set('locations', response.locations);
      });

      if(get(this, 'isFastBoot')) {
        // Pause fastboot render until this completes
        get(this, 'fastboot').deferRendering(promise);
      }
    }
  }),

  selectedLocation: computed('selectedLocationId', 'formattedLocations', function() {
    const selectedId = get(this, 'selectedLocationId');
    if(isPresent(selectedId)) {
      const location = this.get('formattedLocations').find(function(loc) {
        return loc.id.toString() === selectedId.toString();
      });

      if(isPresent(location)) {
        return location;
      }
    }
    return null;
  }),

  formattedLocationName: computed.alias('selectedLocation.formattedLocation'),

  formattedLocations: computed('locations', function() {
    return this.get('locations').map(function(location) {
      return {
        id: location.id,
        formattedLocation: `${location.city}, ${location.state}`
      };
    });
  }),

  actions: {
    updateSelected(opt) {
      set(this, 'selectedLocationId', opt);
    },
    toggleEditing(isEditing) {
      this.toggleProperty('isEditing');

      if (isEditing) {
        const location = get(this, 'selectedLocation');
        this.attrs.onUpdate(location.id, location.formattedLocation);
      }
    }
  }
});
