import Ember from 'ember';
import moment from 'moment';
import EventGroup from 'subtext-ui/models/event-group';

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
          Ember.get(group, 'items').pushObject(event);
        } else {
          group = EventGroup.create({
            value: value,
            displayValue: moment(startsAt).format('dddd, MMMM Do YYYY'),
            paramValue: moment(startsAt).format('YYYY-MM-DD'),
            items: [event]
          });

          groups.push(group);
        }
      });
    }

    return groups.sortBy('value');
  }.property('events.[]'),

  actions: {
    showTail(group) {
      group.set('tailHidden', false);
    }
  }
});
