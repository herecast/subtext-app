import Ember from 'ember';
import moment from 'moment';

const {get, computed, isPresent} = Ember;

export default Ember.Component.extend({
  classNames: 'EventsResultsItem',
  classNameBindings: ['featured:featured'],

  event: null,

  startsAt: computed.oneWay('event.startsAt'),
  venueName: computed.oneWay('event.venueName'),
  venueCity: computed.oneWay('event.venueCity'),
  venueState: computed.oneWay('event.venueState'),
  hasVenue: computed.notEmpty('venue'),
  title: computed.oneWay('event.title'),

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
    }
    return get(this, 'event.id');
  }),

  formattedTime: computed('startsAt', function() {
    const startsAt = get(this, 'startsAt');

    if (isPresent(startsAt)) {
      return moment(startsAt).format('h:mm A');
    }
  }),

  formattedDayToShow: computed('startsAt', function() {
    const startsAt = get(this, 'startsAt');

    if (isPresent(startsAt)) {
      return moment(startsAt).format('MMM Do');
    }
  })
});
