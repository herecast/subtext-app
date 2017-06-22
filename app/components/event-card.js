import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const {
  get,
  isPresent,
  computed
} = Ember;

export default Ember.Component.extend(TrackCard, {
  classNameBindings: ['event.registrationDeadline:hasInfoBanner'],
  attributeBindings: ['data-test-event-card'],
  'data-test-event-card': computed.oneWay('event.id'),
  isPreview: false,
  venueName: computed.oneWay('event.venueName'),
  venueCity: computed.oneWay('event.venueCity'),
  venueState: computed.oneWay('event.venueState'),

  timeRange: computed.oneWay('event.formattedDate'),

  hasVenue: computed.notEmpty('venue'),

  title: computed('event.title', function() {
    // Trim the title to avoid overflow.
    // CSS text-overflow: ellipsis does not work on multi-line overflows.
    const title = get(this, 'event.title');
    return title.length > 45 ? title.substr(0, 45) + '...' : title;
  }),

  venue: computed('venueName', 'venueCity', 'venueState', function() {
    const name  = get(this, 'venueName'),
          city  = get(this, 'venueCity'),
          state = get(this, 'venueState');

    const cityState = [city, state].filter((item) => !!item).join(', ');
    return [name, cityState].filter((item) => !!item).join(' - ');
  }),

  eventId: computed('event.id', 'event.eventInstanceId', function() {
    if (isPresent(get(this, 'event.eventInstanceId'))) {
      return get(this, 'event.eventInstanceId');
    } else {
      return get(this, 'event.id');
    }
  }),

  actions: {
    onTitleClick() {
      const onTitleClick = get(this, 'onTitleClick');
      if (onTitleClick) {
        onTitleClick();
      }
      return true;
    }
  }
});
