import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  isPreview: false,

  title: Ember.computed.oneWay('event.title'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),

  timeRange: Ember.computed.oneWay('event.formattedDate'),

  hasVenue: Ember.computed.notEmpty('venue'),

  venue: function() {
    const name = this.get('venueName');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    if (isPresent(name)) {
      return name;
    } else {
      return [city, state].join(', ');
    }
  }.property('venueName', 'venueCity', 'venueState')
});
