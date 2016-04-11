import Ember from 'ember';
import EventCard from './event-card';
import PreviewScroll from '../mixins/components/card-preview-scroll';

const { computed } = Ember;

function defaultValue(value, placeholder) {
  if (Ember.isPresent(value)) {
    return value;
  } else {
    return placeholder;
  }
}

export default EventCard.extend(PreviewScroll, {
  timeRange: Ember.computed.oneWay('event.eventInstances.firstObject.formattedDate'),

  title: computed('event.title', function() {
    return defaultValue(this.get('event.title'),
      'A short and informative name');
  }),

  venueName: computed('event.venueName', function() {
    return defaultValue(this.get('event.venueName'), 'Location Name');
  }),

  venueAddress: computed('event.venueAddress', function() {
    return defaultValue(this.get('event.venueAddress'), 'Address');
  }),

  venueCity: computed('event.venueCity', function() {
    return defaultValue(this.get('event.venueCity'), 'City');
  }),

  venueState: computed('event.venueState', function() {
    return defaultValue(this.get('event.venueState'), 'State');
  })
});
