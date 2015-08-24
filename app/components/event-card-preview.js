import Ember from 'ember';
import EventCard from './event-card';
import PreviewScroll from '../mixins/components/card-preview-scroll';

function defaultValue(value, placeholder) {
  if (Ember.isPresent(value)) {
    return value;
  } else {
    return placeholder;
  }
}

export default EventCard.extend(PreviewScroll, {
  timeRange: Ember.computed.oneWay('event.eventInstances.firstObject.formattedDate'),

  title: function() {
    return defaultValue(this.get('event.title'),
      'A short and informative name');
  }.property('event.title'),

  venueName: function() {
    return defaultValue(this.get('event.venueName'), 'Location Name');
  }.property('event.venueName'),

  venueAddress: function() {
    return defaultValue(this.get('event.venueAddress'), 'Address');
  }.property('event.venueAddress'),

  venueCity: function() {
    return defaultValue(this.get('event.venueCity'), 'City');
  }.property('event.venueCity'),

  venueState: function() {
    return defaultValue(this.get('event.venueState'), 'State');
  }.property('event.venueState')
});
