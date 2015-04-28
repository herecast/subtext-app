import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  eventsByDate: function() {
    const groups = new Ember.A();
    const events = this.get('events');

    if (!Ember.isEmpty(events)) {
      events.forEach((event) => {
        const startsAt = event.get('startsAt');
        const value = moment(startsAt).format('L');
        let group = groups.findBy('value', value);

        if (Ember.isPresent(group)) {
          Ember.get(group, 'items').push(event);
        } else {
          group = {
            value: value,
            displayValue: moment(startsAt).format('dddd, MMMM Do YYYY'),
            items: [event]
          };

          groups.push(group);
        }
      });
    }

    return groups.sortBy('value');
  }.property('events.[]')
});
