import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  refreshParam: Ember.inject.service('refresh-param'),
  isPreview: false,

  title: Ember.computed.oneWay('event.title'),
  content: Ember.computed.oneWay('event.content'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueAddress: Ember.computed.oneWay('event.venueAddress'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),
  venueZipcode: Ember.computed.oneWay('event.venueZipcode'),

  costType: function() {
    const type = this.get('event.costType');

    if (type === '') {
      return 'N/A';
    } else {
      return type;
    }
  }.property('event.costType'),

  timeRange: function() {
    const startTime = this.get('event.startsAt');
    const endTime = this.get('event.endsAt');

    if (startTime && endTime) {
      return `${startTime.format('LT')} - ${endTime.format('LT')}`;
    }
  }.property('startsAt', 'endsAt'),

  hasVenue: function() {
    const name = this.get('venueName');
    const address = this.get('venueAddress');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    return isPresent(name) && isPresent(address) && isPresent(city) &&
      isPresent(state);

  }.property('venueName', 'venueAddress', 'venueCity', 'venueState')
});
