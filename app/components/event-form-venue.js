import Ember from 'ember';

export default Ember.Component.extend({
  venueId: Ember.computed.alias('event.venueId'),
  venueName: Ember.computed.alias('event.venueName'),
  venueAddress: Ember.computed.alias('event.venueAddress'),
  venueCity: Ember.computed.alias('event.venueCity'),
  venueState: Ember.computed.alias('event.venueState'),
  venueZipcode: Ember.computed.alias('event.venueZipcode'),
  venueUrl: Ember.computed.alias('event.venueUrl'),
  venuePhone: Ember.computed.alias('event.venuePhone'),

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
        venueZipcode: venue.zipcode,
        venueUrl: venue.url,
        venuePhone: venue.phone,
        open: false
      });
    }
  }
});
