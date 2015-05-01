import Ember from 'ember';
import EventGroup from 'subtext-ui/models/event-group';

export default Ember.Component.extend({
  isFilteredByOneDay: function() {
    const start = this.get('startDate');
    const stop = this.get('stopDate');

    return !!start && !!stop && start === stop;
  }.property('startDate', 'stopDate'),

  groupedEvents: function() {
    if (this.get('isFilteredByOneDay')) {
      return this.get('eventsByTime');
    } else {
      return this.get('eventsByDate');
    }
  }.property('events.[]', 'isFilteredByOneDay'),

  buildGroup(displayFormat, convertDate) {
    const groups = new Ember.A();
    const events = this.get('events');

    if (!Ember.isEmpty(events)) {
      events.forEach((event) => {
        const startsAt = event.get('startsAt');
        const value = convertDate(startsAt);
        let group = groups.findBy('value', value);

        if (Ember.isPresent(group)) {
          Ember.get(group, 'items').pushObject(event);
        } else {
          group = EventGroup.create({
            value: value,
            displayValue: startsAt.format(displayFormat),
            paramValue: startsAt.format('YYYY-MM-DD'),
            items: [event]
          });

          groups.push(group);
        }
      });
    }

    return groups.sortBy('value');
  },

  eventsByDate: function() {
    return this.buildGroup('dddd, MMMM Do', function(startsAt) {
      return startsAt.format('L');
    });
  }.property('events.[]'),

  eventsByTime: function() {
    return this.buildGroup('Ha on dddd, MMMM Do', function(startsAt) {
      return parseInt(startsAt.format('H'));
    });
  }.property('events.[]'),

  actions: {
    showTail(group) {
      group.set('tailHidden', false);
    }
  }
});
