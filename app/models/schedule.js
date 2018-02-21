import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ScheduleSummary from 'subtext-ui/mixins/schedule-summary';
import later from 'npm:later';

/* global _ */

const { computed, get, isPresent, set } = Ember;
const { attr } = DS;
const dateFormat = 'MM/DD/YYYY';
const timeFormat = 'hh:mm a';

const getDate = function(datetimeKey) {
  return computed(datetimeKey, {
    get() {
      const datetime = get(this, datetimeKey);

      if (datetime) {
        return datetime.format(dateFormat);
      }
    },
    set(key, value) {
      set(this, datetimeKey, moment(value));

      return value;
    }
  });
};

const getTime = function(datetimeKey, dateKey) {
  return computed(datetimeKey, dateKey, {
    get() {
      const datetime = get(this, datetimeKey);

      if (datetime) {
        return datetime.format(timeFormat);
      }
    },
    set(key, value) {
      // Run next loop for cases where date and time are both set in the same
      // run loop.  - We need the date to be set before this operation.
      Ember.run.next(()=> {
        const  date = get(this, dateKey);

        if(date) {
          const formattedDate = moment(date).format(dateFormat);
          const datetime = moment(`${formattedDate} ${value}`, `${dateFormat} ${timeFormat}`);

          set(this, datetimeKey, datetime);
        }
      });
      return value;
    }
  });
};

export default DS.Model.extend(ScheduleSummary, {
  daysOfWeek: attr('raw'),
  endDate: attr('moment-date'), // date that the repeating schedule runs until
  endsAt: attr('moment-date'), // time of day the event ends
  overrides: attr('raw'),
  presenterName: attr('string'),
  _remove: attr('boolean'),
  repeats: attr('string'),
  startDate: getDate('startsAt'),
  startsAt: attr('moment-date'),
  startTime: getTime('startsAt', 'startDate'),
  stopDate: getDate('endDate'),
  subtitle: attr('string'),
  weeksOfMonth: attr('raw'),

  stopTime: computed('endsAt', {
    get() {
      const datetime = get(this, 'endsAt');

      if (datetime) {
        return datetime.format(timeFormat);
      }
    },
    set(key, value) {
      let datetime = null;

      if (isPresent(value)) {
        const date = moment();
        const formattedDate = date.format(dateFormat);

        datetime = moment(`${formattedDate} ${value}`, `${dateFormat} ${timeFormat}`);
      }

      set(this, 'endsAt', datetime);

      return value;
    }
  }),

  hasExcludedDates: computed('overrides.@each.hidden', function() {
    const overrides = get(this, 'overrides') || [];

    return overrides.any((override) => {
      return override.hidden;
    });
  }),

  schedule: computed('startsAt', 'endDate', 'daysOfWeek', 'repeats', function() {
    const startsAt = get(this, 'startsAt');
    const repeats = get(this, 'repeats');
    const hour = startsAt.hour();
    const minute = startsAt.minute();

    const schedule = later.parse.recur().on(hour).hour().on(minute).minute();

    if (repeats === 'daily') {
      return schedule;
    } else if (repeats === 'weekly' || repeats === 'bi-weekly') {
      const daysOfWeek = get(this, 'daysOfWeek').sort();
      return schedule.on(daysOfWeek).dayOfWeek();
    }
  }),

  dates: computed('schedule', 'startsAt', 'endsAt', function() {
    const repeats = get(this, 'repeats');

    if (repeats === 'monthly') {
      return this._monthlyDates();
    } else {
      // We need to wrap the dates in moment() in order to clone the value
      // so it's not mutated below when we change the hours and minutes.
      const start = moment(get(this, 'startsAt')).toDate();
      const stop = moment(get(this, 'endDate')).toDate();
      const schedule = get(this, 'schedule');
      const maxDates = 100;

      start.setHours(0);
      start.setMinutes(0);
      stop.setHours(23);
      stop.setMinutes(59);

      if (repeats === 'once') {
        return [start];
      } else {
        later.date.localTime();

        const dates = later.schedule(schedule).next(maxDates, start, stop);

        if (repeats === 'bi-weekly') {
          return this._removeEveryX(dates, 2);
        } else {
          return dates;
        }
      }
    }
  }),

  _monthlyDates() {
    const startsAt = get(this, 'startsAt');

    // We need to wrap the dates in moment() in order to clone the value
    // so it's not mutated below when we change the hours and minutes.
    const endDate = moment(get(this, 'endDate'));

    const weeksOfMonth = get(this, 'weeksOfMonth');
    const dayOfWeek = get(this, 'daysOfWeek')[0]-1;

    endDate.hours(23);
    endDate.minutes(59);

    // later.js doesn't support monthly events that happen on the same day,
    // on the nth week of the month. Moment-recur supports this, so we are
    // using it for those occasions.
    const dates = moment().recur(startsAt, endDate).every(dayOfWeek).daysOfWeek()
      .every(weeksOfMonth).weeksOfMonthByDay().all("L")
      .map((date) => { return moment(date).toDate(); });

    return dates;
  },

  _removeEveryX(dates, interval) {
    const daysOfWeek = get(this, 'daysOfWeek');

    const groupedByWeek = _.groupBy(dates, (date, index) => {
      return Math.floor(index/daysOfWeek.length);
    });

    const filteredDates = Object.keys(groupedByWeek).filter((key, index) => {
      return index % interval === 0;
    }).map((key) => { return groupedByWeek[key]; });

    return _.flatten(filteredDates);
  }
});
