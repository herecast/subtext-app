import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { computed: {equal}, set, get } = Ember;

export default Ember.Component.extend(TestSelector, {
  init() {
    this._super(...arguments);
    set(this, 'showNewVenueForm', false);
  },

  classNameBindings: ['hasError:has-error'],
  hasError: Ember.computed.notEmpty('error'),

  venueId: Ember.computed.alias('event.venueId'),
  venueName: Ember.computed.alias('event.venueName'),
  venueAddress: Ember.computed.alias('event.venueAddress'),
  venueCity: Ember.computed.alias('event.venueCity'),
  venueState: Ember.computed.alias('event.venueState'),
  venueStatus: Ember.computed.alias('event.venueStatus'),
  venueZip: Ember.computed.alias('event.venueZip'),
  venueUrl: Ember.computed.alias('event.venueUrl'),

  isPrivate: equal('venueStatus', 'private'),

  actions: {
    showNewVenueForm() {
      set(this, 'showNewVenueForm', true);
    },

    changeVenue() {
      this.send('setVenue', {});
      set(this, 'showNewVenueForm', false);
    },

    setVenue(venue) {
      this.setProperties({
        venueId: venue.id,
        venueName: venue.name,
        venueAddress: venue.address,
        venueCity: venue.city,
        venueState: venue.state,
        venueZip: venue.zip,
        venueUrl: venue.url,
        open: false
      });

      const validateForm = get(this, 'validateForm');
      if (validateForm) {
        validateForm();
      }
    },

    validateForm() {
      const validateForm = get(this, 'validateForm');
      if (validateForm) {
        validateForm();
      }
    },

    togglePrivacy(isPrivate) {
      if (isPrivate) {
        set(this, 'venueStatus', 'new');
      } else {
        set(this, 'venueStatus', 'private');
      }
    }
  }
});
