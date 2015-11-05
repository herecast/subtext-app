import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
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
    },
    
    trackChangeCommunity() {
      let location = this.get('formattedLocations').findBy('id', this.get('selectedLocationId'));
      location = location.formattedLocation;
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};

      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, {'userCommunity': location});
      Ember.merge(props, 
         mixpanel.getNavigationProperties('User', 'Dashboard', 1));
      Ember.merge(props, mixpanel.getNavigationControlProperties('User Profile', 'Change Community'));
      mixpanel.trackEvent('selectNavControl', props);       
    }
  }
});
