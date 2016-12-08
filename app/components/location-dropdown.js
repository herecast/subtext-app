import Ember from 'ember';

const { get, inject, on, computed } = Ember;

export default Ember.Component.extend({
  classNames: ['LocationDropdown'],
  api: inject.service('api'),
  locations: [],
  isEditing: false,

  getLocations: on('init', function() {
    const api = get(this, 'api');

    if (this.get('selectedLocationId') || this.get('isEditing')) {
      api.getLocations().then(response => {
        this.set('locations', response.locations);
      });
    }
  }),

  formattedLocations: computed('locations', function() {
    return this.get('locations').map(function(location) {
      return {
        id: location.id,
        formattedLocation: `${location.city}, ${location.state}`
      };
    });
  }),

  actions: {
    toggleEditing(isEditing) {
      this.toggleProperty('isEditing');

      if (isEditing) {
        const location = this.get('formattedLocations').findBy('id', this.get('selectedLocationId'));

        this.get('session.currentUser').setProperties({
          locationId:  this.get('selectedLocationId'),
          location: location.formattedLocation
        });

        this.attrs.onUpdate();
      }
    }
  }
});
