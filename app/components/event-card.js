import Ember from 'ember';

const {
  get,
  isPresent,
  computed
} = Ember;

export default Ember.Component.extend({
  classNameBindings: ['event.registrationDeadline:hasInfoBanner'],
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

    if (isPresent(name)) {
      return name;
    } else {
      return [city, state].join(', ');
    }
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
      if (this.attrs.onTitleClick) {
        this.attrs.onTitleClick();
      }
      return true;
    }
  }
});
