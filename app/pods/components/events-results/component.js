import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';
import moment from 'moment';
/* global dataLayer */

const {get, set, setProperties, computed, run, isEmpty, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'EventsResults',
  classNameBindings: ['hasActiveCategories:is-filtered'],

  events: null,
  query: null,
  activeCategories: null,
  eventsAreLoading: false,
  reportScrollToEnd: false,

  modals: service(),
  session: service(),

  didUpdateAttrs() {
    const newQuery = get(this, 'events.query');

    if (newQuery !== get(this, 'query')) {
      if (!isEmpty(get(this, 'query'))) {
        run.later(() => {
          setProperties(this, {
            'eventsAreLoading': false,
            'reportScrollToEnd': true
          });
        }, 100);
      }
      set(this, 'query', newQuery);
    }

    this._super(...arguments);
  },



  dayOrWeek: computed('isGroupedByDay', function() {
    return  get(this, 'isGroupedByDay') ? 'Day' : 'Week';
  }),

  hasActiveCategories: computed.gt('activeCategories.length', 0),

  sortedEvents: computed('events.@each.startsAtUnix', function() {
    const events = get(this, 'events');

    return (events) ? events.sortBy('startsAtUnix', 'venueName', 'title') : [];
  }),

  eventsByDay: computed('sortedEvents.[]', function() {
    const events = get(this, 'sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(events, groupBy, 'dddd, MMMM D', (startsAt) => {
      return startsAt.format('L');
    });
  }),

  _gtmTrackEvent(name, content='') {
    get(this,'session').incrementEventSequence('events-interactions')
    .then((eventSequenceIndex) => {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': name,
          'content': content,
          'url': window.location.href,
          'event-sequence': eventSequenceIndex,
          'event_day': moment().format('YYYY-MM-DD')
        });
      }
    });
  },

  actions: {

    loadNextDayOrWeek() {
      if (!get(this, 'eventsAreLoading')) {
        set(this, 'eventsAreLoading', true);
        this.attrs.loadNextDayOrWeek();
      }
    },

    openCalendarWidget() {
      get(this, 'modals').showModal('modals/date-picker').then((date) => {
        this._gtmTrackEvent('events-jumped-to-date', date);
        this.attrs.jumpToDay(date);
      });
      this._gtmTrackEvent('events-clicked-calendar-icon');
    },

    reachedEnd() {
      if (get(this, 'reportScrollToEnd')) {
        this._gtmTrackEvent('events-scrolled-to-end');
        set(this, 'reportScrollToEnd', false);
      }
    }
  }
});
