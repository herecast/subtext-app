import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';

export default Ember.Component.extend({
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

  eventsByDate: function() {
    const events = this.get('sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(events, groupBy, 'dddd, MMMM D', function(startsAt) {
      return startsAt.format('L');
    });
  }.property('sortedEvents.[]'),

  eventsByTime: function() {
    const events = this.get('sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(events, groupBy, 'ha on dddd, MMMM D', function(startsAt) {
      return parseInt(startsAt.format('H'));
    });
  }.property('sortedEvents.[]'),

  actions: {
    showTail(group) {
      group.set('tailHidden', false);
    }
  }
});
