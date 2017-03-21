import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  set,
  setProperties,
  computed: {equal}
} = Ember;

export default Ember.Component.extend(TestSelector, {
  init() {
    this._super(...arguments);
    set(this, 'showNewVenueForm', false);
  },

  isPrivate: equal('event.venueStatus', 'private'),

  actions: {
    showNewVenueForm() {
      set(this, 'showNewVenueForm', true);
    },

    changeVenue() {
      this.send('setVenue', {});
      set(this, 'showNewVenueForm', false);
    },

    setVenue(venue) {
      const event = get(this, 'event');

      setProperties(event, {
        venueId: venue.id,
        venueName: venue.name,
        venueAddress: venue.address,
        venueCity: venue.city,
        venueState: venue.state,
        venueZip: venue.zip,
        venueUrl: venue.url,
      });

      if(get(this, 'update')) {
        get(this, 'update')(venue);
      }
    },

    togglePrivacy(isPrivate) {
      if (isPrivate) {
        set(this, 'event.venueStatus', 'new');
      } else {
        set(this, 'event.venueStatus', 'private');
      }
    }
  }
});
