import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  locations: [],
  isEditing: false,

  getLocations: function() {
    if (this.get('selectedLocationId')) {
      ajax(`${config.API_NAMESPACE}/locations`).then(response => {
        this.set('locations', response.locations);
      });
    }
  }.on('init'),

  formattedLocations: function() {
    return this.get('locations').map(function(location) {
      return {
        id: location.id,
        formattedLocation: `${location.city}, ${location.state}`
      };
    });
  }.property('locations'),

  actions: {
    toggleEditing: function() {
      this.toggleProperty('isEditing');
      if (!this.get('isEditing')) {
        const location = this.get('formattedLocations').findBy('id', this.get('selectedLocationId'));
        this.get('session.currentUser').setProperties({
          locationId:  this.get('selectedLocationId'),
          location: location.formattedLocation
        });
        this.sendAction('onUpdate');
      }
    }
  }
});
