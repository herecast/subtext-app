import Ember from 'ember';
import moment from 'moment';

/* global _ */

const  {
  set,
  get,
  inject,
  run,
  isPresent,
  computed
} = Ember;

export default Ember.Component.extend({
  classNames: ['EventScheduleEditor'],
  modals: inject.service(),
  store: inject.service(),

  schedules: [],

  sendUpdateActionIfGiven() {
    const update = get(this, 'update');
    if(update) {
      run.next(()=> {
        if(!get(this, 'isDestroying')) {
          update(
            get(this, 'schedules')
          );
        }
      });
    }
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

  actions: {
    newSchedule(type) {
      const store = get(this, 'store');
      const schedules = get(this, 'schedules');
      const modals = get(this, 'modals');

      const schedule = store.createRecord('schedule', {
        daysOfWeek: [],
        overrides: [],
        _remove: false,
        weeksOfMonth: [],
        // preset repeats to allow modal to determine
        // which form version to display
        repeats: ( type === 'recurring' ? 'weekly' : 'once' )
      });

      modals.showModal('modals/event-schedule-editor', schedule).then(() => {
        schedules.pushObject(schedule);
        this.sendUpdateActionIfGiven();
      }, () => {
        schedule.destroyRecord();
      });
    },

    editSchedule(schedule) {
      const modals = get(this, 'modals');

      modals.showModal('modals/event-schedule-editor', schedule).then(() => {

        const overridesToRemove = this._findOutOfRangeOverrides(schedule);

        if (isPresent(overridesToRemove)) {
          get(schedule, 'overrides').removeObjects(overridesToRemove);
        }

        this.sendUpdateActionIfGiven();
      });
    },

    removeSchedule(schedule) {
      set(schedule, '_remove', true);
      if (get(schedule, 'isNew')) {
        schedule.destroyRecord();
      }

      this.sendUpdateActionIfGiven();
    },

    includeEvent(schedule, event) {
      const overrides = schedule.get('overrides') || [];
      const eventStart = moment(event.start);

      const toRemove = overrides.find((override) => {
        return eventStart.isSame(override.date, 'day');
      });

      get(schedule, 'overrides').removeObject(toRemove);

      this.sendUpdateActionIfGiven();
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

      this.sendUpdateActionIfGiven();
    }
  }
});
