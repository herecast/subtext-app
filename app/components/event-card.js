import Ember from 'ember';

const isPresent = Ember.isPresent;

export default Ember.Component.extend({
  refreshParam: Ember.inject.service('refresh-param'),
  isPreview: false,

  title: Ember.computed.oneWay('event.title'),
  subtitle: Ember.computed.oneWay('event.subtitle'),
  content: Ember.computed.oneWay('event.content'),
  venueName: Ember.computed.oneWay('event.venueName'),
  venueAddress: Ember.computed.oneWay('event.venueAddress'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),
  venueZip: Ember.computed.oneWay('event.venueZip'),

  costType: function() {
    const type = this.get('event.costType');

    if (Ember.isBlank(type)) {
      return null;
    } else {
      return type;
    }
  }.property('event.costType'),

  timeRange: Ember.computed.oneWay('event.formattedHours'),

  hasVenue: function() {
    const address = this.get('venueAddress');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    return isPresent(address) && isPresent(city) && isPresent(state);

  }.property('venueAddress', 'venueCity', 'venueState')
});
