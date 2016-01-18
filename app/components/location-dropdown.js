import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';
import trackEvent from 'subtext-ui/mixins/track-event';

const { get } = Ember;

export default Ember.Component.extend(trackEvent, {
  locations: [],
  isEditing: false,
  mixpanel: Ember.inject.service('mixpanel'),

  getLocations: function() {
    if (this.get('selectedLocationId') || this.get('isEditing')) {
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

  _getTrackingArguments() {
    let location = get(this, 'formattedLocations').findBy('id', get(this, 'selectedLocationId'));
    location = location.formattedLocation;

    return {
      navigationControlProperties: ['User Profile', 'Change Community'],
      navigationProperties: ['User', 'Dashboard', 1],
      userCommunity: location
    };
  },

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
