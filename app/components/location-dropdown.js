import Ember from 'ember';
import config from './../config/environment';
import ajax from 'ic-ajax';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { on, computed } = Ember;

export default Ember.Component.extend(TrackEvent, {
  locations: [],
  isEditing: false,
  mixpanel: Ember.inject.service('mixpanel'),

  getLocations: on('init', function() {
    if (this.get('selectedLocationId') || this.get('isEditing')) {
      ajax(`${config.API_NAMESPACE}/locations`).then(response => {
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

        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Submit',
          navControl: 'Submit Community Change',
          userCommunity: location.formattedLocation
        });

        this.attrs.onUpdate();
      } else {
        this.trackEvent('selectNavControl', {
          navControlGroup: 'Profile Feature Edit',
          navControl: 'community'
        });
      }
    }
  }
});
