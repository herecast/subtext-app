import Component from '@ember/component';
import { equal, notEmpty, alias } from '@ember/object/computed';
import { get, set } from '@ember/object';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Component.extend(TestSelector, {
  init() {
    this._super(...arguments);
    set(this, 'showNewVenueForm', false);
  },

  classNameBindings: ['hasError:has-error'],
  hasError: notEmpty('error'),

  venueId: alias('event.venueId'),
  venueName: alias('event.venueName'),
  venueAddress: alias('event.venueAddress'),
  venueCity: alias('event.venueCity'),
  venueState: alias('event.venueState'),
  venueStatus: alias('event.venueStatus'),
  venueZip: alias('event.venueZip'),
  venueUrl: alias('event.venueUrl'),

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
