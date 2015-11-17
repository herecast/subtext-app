import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  eventLayout: 'grid',
  classNameBindings: ['isListLayout:u-colorBgPrimary'],

  isListLayout: computed.equal('eventLayout', 'list'),

  sectionHeaderTextClasses: computed('isListLayout', 'isFilteredByOneDay', function() {
    const isListLayout = get(this, 'isListLayout');
    const isFilteredByOneDay = get(this, 'isFilteredByOneDay');

    if (isFilteredByOneDay) {
      if (isListLayout) {
        return 'SectionHeader-text';
      } else {
        return 'SectionHeader-text SectionHeader-text--secondaryBg';
      }
    } else {
      if (isListLayout) {
        return 'SectionHeader-text SectionHeader-link';
      } else {
        return 'SectionHeader-text SectionHeader-text--secondaryBg SectionHeader-link';
      }
    }
  }),

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
