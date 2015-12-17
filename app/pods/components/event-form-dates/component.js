import Ember from 'ember';
import moment from 'moment';

/* global _ */

const  { set, get, inject, run, isEmpty, isPresent, computed } = Ember;

export default Ember.Component.extend({
  store: inject.service(),

  errors: null,

  schedules: [],

  showScheduleForm: null,

  init() {
    this._super(...arguments);
    set(this, 'newSchedule', null);
  },

  hasSingleDate: computed('schedules.[].length', function() {
    const schedules = get(this, 'schedules');
    return schedules.any(function(schedule) {
      return schedule.get('repeats') === 'once';
    });
  }),

  hasRecurringSchedule: computed('schedules.[].length', function() {
    const schedules = get(this, 'schedules');

    return schedules.any(function(schedule) {
      const repeats = schedule.get('repeats');
      return (repeats === 'weekly') ||
             (repeats === 'bi-weekly') ||
             (repeats === 'monthly');
    });
  }),

  // Finds overrides that no longer fall within the current date range.
  // Comparison is done using unix timestamp so that integer comparison is used.
  _findOutOfRangeOverrides(schedule) {
    const overrides = get(schedule, 'overrides') || [];

    const overrideDates = overrides.map((override) => {
      return moment(override.date).unix();
    });

    const dates = get(schedule, 'dates').map((date) => {
      return moment(date).unix();
    });

    return _.difference(overrideDates, dates).map((dateToRemove) => {
      return overrides.find((override) => {
        return moment(override.date).unix() === dateToRemove;
      });
    });
  },

  _invalidTime(time) {
    if (isEmpty(time)) {
      return false;
    } else {
      const timeRegex = /[0-9]+:[0-9]+ am|pm+/;

      return isEmpty(time.match(timeRegex));
    }
  },

  actions: {
    buildNewSchedule(type) {
      const schedule = get(this, 'store').createRecord('schedule', {
        daysOfWeek: [],
        overrides: [],
        _remove: false,
        weeksOfMonth: []
      });

      run(() => { set(this, 'newSchedule', schedule); });

      set(this, 'showScheduleForm', `${type}`);
    },

    validateScheduleData(repeatType, scheduleData) {
      const errors = {};

      if(repeatType === 'recurring') {
        const { startTime, startDate, stopTime, stopDate, daysOfWeek } = scheduleData;

        // date errors
        if(isEmpty(startDate) || isEmpty(stopDate)) {
          if (isEmpty(startDate)) {
            errors.startDateError = "Start date cannot be blank.";
          }

          if (isEmpty(stopDate)) {
            errors.stopDateError = "End date cannot be blank.";
          }
        } else if (moment(stopDate).isBefore(moment(startDate))) {
          errors.dateError = "End date cannot be before start date.";
        }

        // daysOfWeek errors
        if (scheduleData.repeats === 'weekly' || scheduleData.repeats === 'bi-weekly') {
          if (isEmpty(daysOfWeek)) {
            errors.daysError = "You must choose at least one day of the week.";
          }
        }

        // Time errors
        if(isEmpty(startTime)) {
          errors.startTimeError = "Start time cannot be blank.";
        } else if (this._invalidTime(startTime)) {
          errors.startTimeError = "Start time format is invalid.";
        } else {
          if (isPresent(stopTime)) {
            if (this._invalidTime(stopTime)) {
              errors.timeError = "End time format is invalid.";
            } else if (moment(stopTime, 'h:mma').isBefore(moment(startTime, 'h:mma'))) {
              errors.timeError = "End time cannot be before start time.";
            }
          }
        }
      } else if (repeatType === 'single') {
        const { startTime, startDate, stopTime } = scheduleData;

        if(isEmpty(startDate)) {
          errors.dateError = "Date cannot be blank.";
        }

        if(isEmpty(startTime)) {
          errors.startTimeError = "Start time cannot be blank.";
        } else if (this._invalidTime(startTime)) {
          errors.startTimeError = "Start time format is invalid.";
        } else {
          if (isPresent(stopTime)) {
            if (this._invalidTime(stopTime)) {
              errors.timeError = "End time format is invalid.";
            } else if (moment(stopTime, 'h:mma').isBefore(moment(startTime, 'h:mma'))) {
              errors.timeError = "End time cannot be before start time.";
            }
          }
        }
      }

      const hasErrors = Object.keys(errors).length > 0;

      return hasErrors ? errors : true;
    },

    addNewSchedule(schedule, scheduleData) {
      run(() => { schedule.setProperties(scheduleData); });

      get(this, 'schedules').pushObject(schedule);
    },

    updateSchedule(schedule, scheduleData) {
      run(() => {
        schedule.setProperties(scheduleData);
      });

      const overridesToRemove = this._findOutOfRangeOverrides(schedule);

      if (isPresent(overridesToRemove)) {
        get(schedule, 'overrides').removeObjects(overridesToRemove);
      }
    },

    removeSchedule(schedule) {
      if (get(schedule, 'isNew')) {
        schedule.destroyRecord();
      } else {
        set(schedule, '_remove', true);
      }
    },

    hideScheduleForm(schedule) {
      if (schedule && get(schedule, 'isNew')) {
        schedule.destroyRecord();
      }

      set(this, 'showScheduleForm', null);
    },

    includeEvent(schedule, event) {
      const overrides = schedule.get('overrides') || [];
      const eventStart = moment(event.start);

      const toRemove = overrides.find((override) => {
        return eventStart.isSame(override.date, 'day');
      });

      get(schedule, 'overrides').removeObject(toRemove);
    },

    excludeEvent(schedule, event) {
      const override = {
        date: event.start.toDate(),
        hidden: true
      };

      if (get(schedule, 'overrides')) {
        get(schedule, 'overrides').pushObject(override);
      } else {
        set(schedule, 'overrides', [override]);
      }
    }
  }
});
