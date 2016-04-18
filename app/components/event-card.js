import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get, isPresent, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  classNameBindings: ['event.registrationDeadline:hasRegistrationDeadline'],
  isPreview: false,
  venueName: Ember.computed.oneWay('event.venueName'),
  venueCity: Ember.computed.oneWay('event.venueCity'),
  venueState: Ember.computed.oneWay('event.venueState'),

  timeRange: Ember.computed.oneWay('event.formattedDate'),

  hasVenue: Ember.computed.notEmpty('venue'),

  title: computed('event.title', function() {
    // Trim the title to avoid overflow.
    // CSS text-overflow: ellipsis does not work on multi-line overflows.
    const title = get(this, 'event.title');
    return title.length > 45 ? title.substr(0, 45) + '...' : title;
  }),

  venue: computed('venueName', 'venueCity', 'venueState', function() {
    const name = this.get('venueName');
    const city = this.get('venueCity');
    const state = this.get('venueState');

    if (isPresent(name)) {
      return name;
    } else {
      return [city, state].join(', ');
    }
  }),

  eventId: computed('event.id', 'event.eventInstanceId', function() {
    if (Ember.isPresent(this.get('event.eventInstanceId'))) {
      return this.get('event.eventInstanceId');
    } else {
      return this.get('event.id');
    }
  }),

  actions: {
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'Event',
        navControlGroup: 'Event Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
