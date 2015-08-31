import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  isPreview: false,

  title: Ember.computed.oneWay('event.title'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueAddress: Ember.computed.oneWay('event.venueAddress'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),

  timeRange: Ember.computed.oneWay('event.formattedDate'),

  timeRangeMobile: function() {
    const startTime = this.get('event.startsAt').format('h:mmA');

    if (Ember.isEmpty(this.get('event.endsAt'))) {
      return startTime;
    } else {
      const endTime = this.get('event.endsAt').format('h:mmA');

      return `${startTime}-${endTime}`;
    }
  }.property('event.{startsAt,endsAt}'),

  hasVenue: Ember.computed.notEmpty('venue'),

  venue: function() {
    const name = this.get('venueName');
    const address = this.get('venueAddress');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    if (isPresent(name)) {
      return name;
    } else {
      return [address, city, state].join(', ');
    }
  }.property('venueName', 'venueAddress', 'venueCity', 'venueState')
});
