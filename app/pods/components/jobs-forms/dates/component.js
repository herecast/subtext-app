import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { isPresent, isEmpty } from '@ember/utils';
import { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';
/* global _ */

export default Component.extend({
  store: service(),

  errors: null,
  showScheduleForm: null,
  newSchedule: null,
  model: null,
  schedules: alias('model.schedules'),

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

  _isInvalidTime(time) {
    if (isEmpty(time)) {
      return false;
    } else {
      const timeRegex = /[0-9]+:[0-9]+ am|pm+/;

      return isEmpty(time.match(timeRegex));
    }
  },

  _getTimeErrors(startTime, stopTime) {
    const timeErrors = {};

    // Time errors
    if(isEmpty(startTime)) {
      timeErrors.startTimeError = "Start time cannot be blank.";
    } else if (this._isInvalidTime(startTime)) {
      timeErrors.startTimeError = "Start time format is invalid.";
    } else {
      if (isPresent(stopTime)) {
        if (this._isInvalidTime(stopTime)) {
          timeErrors.timeError = "End time format is invalid.";
        } else if (moment(stopTime, 'h:mma').isBefore(moment(startTime, 'h:mma'))) {
          timeErrors.timeError = "End time cannot be before start time.";
        }
      }
    }

    return timeErrors;
  },

  _getRecurringEventErrors(scheduleData) {
    const { startTime, startDate, stopTime, stopDate, daysOfWeek } = scheduleData;
    const errors = {};

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

    const timeErrors = this._getTimeErrors(startTime, stopTime);
    merge(errors, timeErrors);

    return errors;
  },

  _getSingleEventErrors(scheduleData) {
    const { startTime, startDate, stopTime } = scheduleData;
    const errors = {};

    if(isEmpty(startDate)) {
      errors.dateError = "Date cannot be blank.";
    }

    const timeErrors = this._getTimeErrors(startTime, stopTime);
    merge(errors, timeErrors);

    return errors;
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
      let errors = {};

      if(repeatType === 'recurring') {
        errors = this._getRecurringEventErrors(scheduleData);
      } else if (repeatType === 'single') {
        errors = this._getSingleEventErrors(scheduleData);
      }

      const hasErrors = Object.keys(errors).length > 0;

      return hasErrors ? errors : true;
    },

    addNewSchedule(schedule, scheduleData) {
      run(() => {
        schedule.setProperties(scheduleData);
      });

      get(this, 'schedules').pushObject(schedule);

      const model = get(this, 'model');
      set(model, 'hasDirtyAttributes', true);

      const validateForm = get(this, 'validateForm');
      if (validateForm) {
        validateForm();
      }
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

        const model = get(this, 'model');
        set(model, 'hasDirtyAttributes', true);
      }

      const validateForm = get(this, 'validateForm');
      if (validateForm) {
        validateForm();
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
