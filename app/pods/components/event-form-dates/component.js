import Ember from 'ember';
import moment from 'moment';

const  { set, get, inject, run, isEmpty, computed } = Ember;

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

  actions: {
    buildNewSchedule(type) {
      const schedule = get(this, 'store').createRecord('schedule', { });

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

        // time errors
        if (isEmpty(startTime) || isEmpty(stopTime)) {
          if (isEmpty(startTime)) {
            errors.startTimeError = "Start time cannot be blank.";
          }
        } else if (moment(stopTime, 'h:mma').isBefore(moment(startTime, 'h:mma'))) {
          errors.timeError = "End time cannot be before start time.";
        }

      } else if (repeatType === 'single') {
        const { startTime, startDate, stopTime } = scheduleData;

        if(isEmpty(startDate)) {
          errors.dateError = "Date cannot be blank.";
        }

        if (isEmpty(startTime) || isEmpty(stopTime)) {
          if(isEmpty(startTime)) {
            errors.startTimeError = "Start time cannot be blank.";
          }
        } else if (moment(stopTime, 'h:mma').isBefore(moment(startTime, 'h:mma'))) {
          errors.timeError = "End time cannot be before start time.";
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
      // For now, we are dumping the
      // schedule's overrides each time there
      // is a change to the underlying pattern
      // since we don't know if an overrides falls
      // on one of the new dates
      scheduleData.overrides = [];

      schedule.setProperties(scheduleData);
    },

    removeSchedule(schedule) {
      set(schedule, '_remove', true);
    },

    hideScheduleForm(schedule) {
      if (schedule && get(schedule, 'isNew')) {
        schedule.destroyRecord();
      }

      set(this, 'showScheduleForm', null);
    },

    includeEvent(schedule, event) {
      const overrides = schedule.get('overrides');
      const eventStart = moment(event.start);

      const toRemove = overrides.find((override) => {
        return eventStart.isSame(override.date, 'day');
      });

      get(schedule, 'overrides').removeObject(toRemove);
    },

    excludeEvent(schedule, event) {
      schedule.get('overrides').pushObject({
        date: event.start.toDate(),
        hidden: true
      });
    }
  }
});
