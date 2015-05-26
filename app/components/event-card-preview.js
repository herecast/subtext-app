import Ember from 'ember';
import EventCard from './event-card';

function defaultValue(value, placeholder) {
  if (Ember.isPresent(value)) {
    return value;
  } else {
    return placeholder;
  }
}

export default EventCard.extend({
  timeRange: Ember.computed.oneWay('event.firstInstanceTimeRange'),
  subtitle: Ember.computed.oneWay('event.firstIntanceSubtitle'),

  title: function() {
    return defaultValue(this.get('event.title'),
      'A short and informative name');
  }.property('event.title'),

  content: function() {
    return defaultValue(this.get('event.content'),
      'An inspiring description that will motivate people to attend.');
  }.property('event.content'),

  venueName: function() {
    return defaultValue(this.get('event.venueName'), 'Location Name');
  }.property('event.venueName'),

  venueCity: function() {
    return defaultValue(this.get('event.venueCity'), 'City');
  }.property('event.venueCity'),

  venueState: function() {
    return defaultValue(this.get('event.venueState'), 'State');
  }.property('event.venueState'),

  venueZipcode: function() {
    return defaultValue(this.get('event.venueZipcode'), '12345');
  }.property('event.venueZipcode')
});