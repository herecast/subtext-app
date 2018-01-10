import Ember from 'ember';

const { get, computed, isPresent } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-EventInfo',
  cost: null,
  address: null,
  city: null,
  state: null,

  admission: computed('cost', function() {
    const cost = get(this, 'cost');

    return isPresent(cost) ? cost : 'See details';
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
