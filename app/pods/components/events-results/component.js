import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';
import moment from 'moment';

const {
  get,
  set,
  setProperties,
  computed,
  run,
  isEmpty,
  isPresent,
  inject:{service}
} = Ember;

export default Ember.Component.extend({
  classNames: 'EventsResults',

  events: null,
  query: null,
  eventsAreLoading: false,
  reportScrollToEnd: false,

  modals: service(),
  session: service(),
  tracking: service(),

  startDate: null,
  enabledEventDays: [],
  updateStartDate: function(){},
  updateEnabledEventDays: function(){},

  momentStartDateOrNow: computed('startDate', function() {
    let startDate = get(this, 'startDate');
    if (isEmpty(startDate)) {
      startDate = moment();
    }

    return moment(startDate);
  }),

  init() {
    this._super(...arguments);
    this._resetVisibleDates();
  },

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

  didReceiveAttrs() {
    this._super(...arguments);

    this._resetVisibleDates();
    this.updateEnabledEventDays(get(this, 'momentStartDateOrNow'));
  },

  dayOrWeek: computed('isGroupedByDay', function() {
    return  get(this, 'isGroupedByDay') ? 'Day' : 'Week';
  }),

  sortedEvents: computed('events.@each.startsAtUnix', function() {
    const events = get(this, 'events');

    return (events) ? events.sortBy('startsAtUnix', 'venueName', 'title') : [];
  }),

  loadedEventDates: computed.mapBy('sortedEvents', 'startsAt'),

  eventsByDay: computed('sortedEvents.[]', function() {
    const events = get(this, 'sortedEvents');
    const groupBy = 'startsAt';

    return buildGroup(
      events,
      groupBy, 'dddd, MMMM D',
      (startsAt) => {
        return startsAt.format('L');
    });
  }),

  _gtmTrackEvent(name, context='') {
    get(this,'session').incrementEventSequence('events-interactions')
      .then((eventSequenceIndex) => {
        get(this, 'tracking').push({
          'event': name,
          'context': context,
          'url': window.location.href,
          'event-sequence': eventSequenceIndex,
          'event_day': get(this, 'momentStartDateOrNow').format('YYYY-MM-DD')
        });
      });
  },

  actions: {
    /**
     * This action is called when a date header is scrolled into or out of the
     * viewport.  Since there is only one generic callback, this takes the
     * event name and switches the action it takes with it.
     */
    viewportDateScroll(date, event) {
      const visibleDates = get(this, 'visibleDates');
      if(event === 'EnterViewport') {
        if(visibleDates.indexOf(date) === -1) {
          visibleDates.pushObject(date);
        }

      } else if(event === 'ExitViewport') {
        visibleDates.removeObject(date);
      }
    },

    reachedEnd() {
      if (get(this, 'reportScrollToEnd')) {
        this._gtmTrackEvent('events-scrolled-to-end');
        set(this, 'reportScrollToEnd', false);
      }
    },

    openCalendarWidget(source) {
      const startDate = get(this, 'momentStartDateOrNow');
      const selectedDay = startDate.toDate();
      const updateEnabledEventDays = get(this, 'updateEnabledEventDays');

      updateEnabledEventDays(selectedDay).then(() => {
        const enabledDays = get(this, 'enabledEventDays').mapBy('date').uniq();

        get(this, 'modals').showModal('modals/date-picker', { enabledDays, selectedDay }).then((date) => {
          this._gtmTrackEvent('events-jumped-to-date', date);
          get(this, 'updateStartDate')(date);
        });
      });

      this._gtmTrackEvent(`events-clicked-calendar-icon`, source);
    },

    jumpToPrevDay() {
      const prevDateOnPage = get(this, '_previousLoadedDate');

      if(isPresent(prevDateOnPage) && this._canScrollIntoView(prevDateOnPage)) {
        this._gtmTrackEvent(`events-clicked-prev-day`, prevDateOnPage.format('YYYY-MM-DD'));
        this._scrollIntoView(prevDateOnPage);
        return;
      } else {
        const prevDate = get(this, '_previousEnabledDate').format('YYYY-MM-DD');

        this._gtmTrackEvent(`events-clicked-prev-day`, prevDate);
        return this._startOnDate(prevDate);
      }
    },

    jumpToNextDay() {
      const nextDateOnPage = get(this, '_nextLoadedDate');

      if(isPresent(nextDateOnPage) && this._canScrollIntoView(nextDateOnPage)) {
        this._gtmTrackEvent(`events-clicked-next-day`, nextDateOnPage.format('YYYY-MM-DD'));

        this._scrollIntoView(nextDateOnPage);
        return;

      } else {

        const nextDate = get(this, '_nextEnabledDate').format('YYYY-MM-DD');
        this._gtmTrackEvent(`events-clicked-next-day`, nextDate);
        return this._startOnDate(nextDate);
      }
    }
  },

  /** Private **/

  _startOnDate(date) {
    return get(this, 'updateStartDate')(
      date
    );
  },

  _scrollIntoView(date) {
    const fDate = moment(date).format('YYYY-MM-DD');
    const el = this.$(`#${fDate}`);

    // Scroll to next event day section
    el[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  },

  _canScrollIntoView(date) {
    if(isPresent(date)) {
      const fDate = moment(date).format('YYYY-MM-DD');
      const el = this.$(`#${fDate}`);

      return el.length > 0;
    } else {
      return false;
    }
  },

  _resetVisibleDates() {
    set(this, 'visibleDates', []);
  },

  _previousLoadedDate: computed('visibleDates.[]', 'loadedEventDates.[]', 'momentStartDateOrNow', function() {
    const loadedEventDates = get(this, 'loadedEventDates');
    const firstVisibleDate = get(this, 'visibleDates').sort()[0];

    let currentDate = get(this, 'momentStartDateOrNow').startOf('day');

    if(firstVisibleDate) {
      currentDate = moment(firstVisibleDate).startOf('day');
    }

    return loadedEventDates.slice().reverse().find((date) => {
      return moment(date).startOf('day').isBefore( currentDate );
    });
  }),

  _previousEnabledDate: computed('visibleDates.[]', 'enabledDates.[]', 'momentStartDateOrNow', function() {
    const enabledEventDays = get(this, 'enabledEventDays');
    const firstVisibleDate = get(this, 'visibleDates').sort()[0];

    let currentDate = get(this, 'momentStartDateOrNow').startOf('day');

    if(firstVisibleDate) {
      currentDate = moment(firstVisibleDate).startOf('day');
    }

    const prevEnabledDay = enabledEventDays.slice().reverse().find((day) => {
      return moment(day.date).startOf("day").isBefore( currentDate );
    });

    if(prevEnabledDay) {
      return moment(prevEnabledDay.date);
    } else {
      return currentDate.subtract(1, 'days');
    }
  }),

  _nextLoadedDate: computed('visibleDates.[]', 'loadedEventDates.[]', 'momentStartDateOrNow', function() {
    const lastVisibleDate = get(this, 'visibleDates').sort().slice(-1)[0];

    if(lastVisibleDate) {
      const currentDate = moment(lastVisibleDate).startOf('day');
      const loadedEventDates = get(this, 'loadedEventDates');

      return loadedEventDates.find((date) => {
        return moment(date).startOf('day').isAfter( currentDate );
      });
    } else {
      return null;
    }
  }),

  _nextEnabledDate: computed('visibleDates.[]', 'enabledDates.[]', 'momentStartDateOrNow', function() {
    const enabledEventDays = get(this, 'enabledEventDays');
    const lastVisibleDate = get(this, 'visibleDates').sort().slice(-1)[0];

    let currentDate = get(this, 'momentStartDateOrNow').startOf('day');

    if(lastVisibleDate) {
      currentDate = moment(lastVisibleDate).startOf('day');
    }

    const nextEnabledDay = enabledEventDays.find((day) => {
      return moment(day.date).startOf("day").isAfter( currentDate );
    });

    if(nextEnabledDay) {
      return moment(nextEnabledDay.date);
    } else {
      return currentDate.add(1, 'days');
    }
  })
});
