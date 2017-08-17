import Ember from 'ember';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-EventInfo',

  startTime: null,
  endTime: null,
  cost: null,
  address: null,
  city: null,
  state: null,

  admission: computed('cost', function() {
    const cost = get(this, 'cost');

    return isPresent(cost) ? cost : 'See details';
  }),

  eventTime: computed('startTime', 'endTime', function() {
    const startTime = get(this, 'startTime') || null;
    const endTime = get(this, 'endTime') || null;

    if (isPresent(startTime)) {
      let eventTime = startTime;

      if (isPresent(endTime)) {
        eventTime += ` - ${endTime}`;
      }

      return eventTime;
    }

    return false;
  }),

  eventLocation: computed('city', 'state', function() {
    const city = get(this, 'city');
    const state = get(this, 'state');

    let eventLocation = city;

    if (isPresent(state)) {
      eventLocation += `, ${state}`;
    }

    return eventLocation;
  })
});
