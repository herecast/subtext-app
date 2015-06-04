import Ember from 'ember';
import EventGroup from 'subtext-ui/models/event-group';

export default Ember.Component.extend({
  refreshParam: Ember.inject.service('refresh-param'),

  sortedEvents: function() {
    const events = this.get('events');

    if (events) {
      return events.sortBy('startsAt');
    } else {
      return [];
    }
  }.property('events.@each.startsAt'),

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
  }.property('sortedEvents.[]', 'isFilteredByOneDay'),

  buildGroup(displayFormat, convertDate) {
    const groups = new Ember.A();
    const events = this.get('sortedEvents');

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
    return this.buildGroup('dddd, MMMM D', function(startsAt) {
      return startsAt.format('L');
    });
  }.property('sortedEvents.[]'),

  eventsByTime: function() {
    return this.buildGroup('ha on dddd, MMMM D', function(startsAt) {
      return parseInt(startsAt.format('H'));
    });
  }.property('sortedEvents.[]'),

  actions: {
    showTail(group) {
      group.set('tailHidden', false);
    }
  }
});
