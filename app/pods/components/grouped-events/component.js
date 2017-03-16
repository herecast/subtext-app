import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';

const {
  computed,
  get,
  inject
} = Ember;

export default Ember.Component.extend({
  startDate: null,
  stopDate: null,
  events: null, // events => sortedEvents => groupedEvents
  eventLayout: 'grid',
  modals: inject.service(),

  classNameBindings: ['isListLayout:u-colorBgPrimary'],

  isListLayout: computed.equal('eventLayout', 'list'),

  sectionHeaderTextClasses: computed('isListLayout', 'isFilteredByOneDay', function() {
    const isListLayout = get(this, 'isListLayout');
    const isFilteredByOneDay = get(this, 'isFilteredByOneDay');
    const baseKlass = 'SectionHeader-text';
    let secondaryKlass = null;

    if (isFilteredByOneDay) {
      if (!isListLayout) {
        secondaryKlass = 'SectionHeader-text--secondaryBg';
      }
    } else {
      secondaryKlass = (isListLayout) ? 'SectionHeader-link' : 'SectionHeader-text--secondaryBg SectionHeader-link';
    }

    return (secondaryKlass) ? `${baseKlass} ${secondaryKlass}` : baseKlass;
  }),

  sortedEvents: computed('events.@each.startsAt', function() {
    const events = this.get('events');

    return (events) ? events.sortBy('startsAt') : [];
  }),

  isFilteredByOneDay: computed('startDate', 'stopDate', function() {
    const start = this.get('startDate');
    const stop = this.get('stopDate');

    return !!start && !!stop && start === stop;
  }),

  groupedEvents: computed('sortedEvents.[]', 'isFilteredByOneDay', function() {
    const isFilteredByOneDay = this.get('isFilteredByOneDay');

    return (isFilteredByOneDay) ? this.get('eventsByTime') : this.get('eventsByDate');
  }),

  eventsByDate: computed('sortedEvents.[]', function() {
    const events = this.get('sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(events, groupBy, 'dddd, MMMM D', (startsAt) => {
      return startsAt.format('L');
    });
  }),

  eventsByTime: computed('sortedEvents.[]', function() {
    const events = this.get('sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(events, groupBy, 'ha on dddd, MMMM D', (startsAt) => {
      return parseInt(startsAt.format('H'));
    });
  }),

  actions: {
    showTail(group) {
      group.set('tailHidden', false);
    },

    openCalendarWidget() {
      get(this, 'modals').showModal('modals/date-picker').then((date) => {
        const updateJumpTarget = get(this, 'updateJumpTarget');
        if (updateJumpTarget) {
          updateJumpTarget(date);
        }
      });
    }
  }
});
