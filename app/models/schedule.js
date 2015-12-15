import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ScheduleSummary from 'subtext-ui/mixins/schedule-summary';

/* global later, _ */

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
      const date = get(this, dateKey);

      if(date) {
        const formattedDate = moment(date).format(dateFormat);
        const datetime = moment(`${formattedDate} ${value}`, `${dateFormat} ${timeFormat}`);

        set(this, datetimeKey, datetime);
      }
      return value;
    }
  });
};

export default DS.Model.extend(ScheduleSummary, {
  daysOfWeek: attr('raw', {defaultValue: []}),
  endsAt: attr('moment-date'), // time of day the event ends
  endDate: attr('moment-date'), // date that the repeating schedule runs until
  repeats: attr('string'),
  overrides: attr('raw', {defaultValue: []}),
  startsAt: attr('moment-date'),
  subtitle: attr('string'),
  presenterName: attr('string'),
  _remove: attr('boolean', {defaultValue: false}),
  weeksOfMonth: attr('raw', {defaultValue: []}),

  startDate: getDate('startsAt'),
  stopDate: getDate('endDate'),
  startTime: getTime('startsAt', 'startDate'),

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
    return get(this, 'overrides').any((override) => {
      return override.hidden;
    });
  }),

  schedule: computed('startsAt', 'endDate', 'daysOfWeek', 'repeats', function() {
    const startsAt = get(this, 'startsAt');
    const repeats = get(this, 'repeats');
    const daysOfWeek = get(this, 'daysOfWeek');
    const hour = startsAt.hour();
    const minute = startsAt.minute();

    const schedule = later.parse.recur().on(hour).hour().on(minute).minute();

    if (repeats === 'daily') {
      return schedule;
    } else if (repeats === 'weekly' || repeats === 'bi-weekly') {
      return schedule.on(daysOfWeek).dayOfWeek();
    }
  }),

  dates: computed('schedule', 'startsAt', 'endsAt', function() {
    const repeats = get(this, 'repeats');

    if (repeats === 'monthly') {
      return this._monthlyDates();
    } else {
      const start = get(this, 'startsAt').toDate();
      const stop = get(this, 'endDate').toDate();
      const schedule = get(this, 'schedule');
      const maxDates = 100;

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
    // later.js doesn't support monthly events that happen on the same day,
    // on the nth week of the month. Moment-recur supports this, so we are
    // using it for those occasions.
    const startsAt = get(this, 'startsAt');
    const endDate = get(this, 'endDate');
    const weeksOfMonth = get(this, 'weeksOfMonth');
    const dayOfWeek = get(this, 'daysOfWeek')[0]-1;

    endDate.hours(23);
    endDate.minutes(59);

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
