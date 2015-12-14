import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ScheduleSummary from 'subtext-ui/mixins/schedule-summary';

/* global later, _ */

const { computed, get, set } = Ember;
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

      return moment(value);
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
        const formattedDate = date.format(dateFormat);
        const datetime = moment(`${formattedDate} ${value}`, `${dateFormat} ${timeFormat}`);

        set(this, datetimeKey, datetime);
      }
      return value;
    }
  });
};

export default DS.Model.extend(ScheduleSummary, {
  daysOfWeek: attr('raw', {defaultValue: []}),
  endsAt: attr('moment-date'),
  repeats: attr('string'),
  overrides: attr('raw', {defaultValue: []}),
  startsAt: attr('moment-date'),
  subtitle: attr('string'),
  presenterName: attr('string'),
  _remove: attr('boolean', {defaultValue: false}),
  weeksOfMonth: attr('raw', {defaultValue: []}),

  startDate: getDate('startsAt'),
  stopDate: getDate('endsAt'),
  startTime: getTime('startsAt', 'startDate'),
  stopTime: getTime('endsAt', 'stopDate'),

  hasExcludedDates: computed('overrides.@each.hidden', function() {
    return get(this, 'overrides').any((override) => {
      return override.hidden;
    });
  }),

  schedule: computed('startsAt', 'daysOfWeek', 'repeats', function() {
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

  dates: computed('schedule', function() {
    const repeats = get(this, 'repeats');

    if (repeats === 'monthly') {
      return this._monthlyDates();
    } else {
      const start = get(this, 'startsAt').toDate();
      const stop = get(this, 'endsAt').toDate();
      const schedule = get(this, 'schedule');
      const maxDates = 100;

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
    const endsAt = get(this, 'endsAt');
    const weeksOfMonth = get(this, 'weeksOfMonth');
    const dayOfWeek = get(this, 'daysOfWeek')-1;

    const dates = moment().recur(startsAt, endsAt).every(dayOfWeek).daysOfWeek()
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
