import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get, isPresent } = Ember;

export default Ember.Component.extend(TrackCard, {
  classNameBindings: ['event.registrationDeadline:hasRegistrationDeadline'],
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
  }.property('venueName', 'venueCity', 'venueState'),

  eventId: function() {
    if (Ember.isPresent(this.get('event.eventInstanceId'))) {
      return this.get('event.eventInstanceId');
    } else {
      return this.get('event.id');
    }
  }.property('event.id', 'event.eventInstanceId'),

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
