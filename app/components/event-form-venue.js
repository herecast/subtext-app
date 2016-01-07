import Ember from 'ember';

const { computed: {equal}, set } = Ember;

export default Ember.Component.extend({
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
    changeVenue() {
      this.send('setVenue', {});
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

      this.attrs.validateForm();
    },

    validateForm() {
      this.attrs.validateForm();
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
