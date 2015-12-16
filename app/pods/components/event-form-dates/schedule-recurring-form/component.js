import Ember from 'ember';
import moment from 'moment';
import ScheduleSummary from 'subtext-ui/mixins/schedule-summary';

const { get, set, computed, run, isEmpty, observer } = Ember;

const repeatTypes = [{ key: 'Daily', value: 'daily' }, { key: 'Weekly', value: 'weekly' },
      { key: 'Bi-Weekly', value: 'bi-weekly' },
      { key: 'Monthly', value: 'monthly' }];

export default Ember.Component.extend(ScheduleSummary, {
  schedule: null,
  errors: null,

  init() {
    this._super(...arguments);
    this.initValues();
    this.initDays();
  },

  initValues() {
    const schedule = get(this, 'schedule');
    const properties = schedule.getProperties(
      'startDate', 'startTime', 'stopDate', 'stopTime', 'daysOfWeek',
      'weeksOfMonth', 'subtitle', 'presenterName');

    properties.repeats = schedule.getWithDefault('repeats', 'weekly');
    properties.startTime = schedule.getWithDefault('startTime', '09:00 am');
    properties.stopTime = get(schedule, 'stopTime');
    properties.daysOfWeek = schedule.getWithDefault('daysOfWeek', []);
    properties.weeksOfMonth = schedule.getWithDefault('weeksOfMonth', []);

    run(() => { this.setProperties(properties); });
  },

  initDays() {
    const daysOfWeek = get(this, 'daysOfWeek');

    const days = [{ key: 'Su', value: 1 }, { key: 'M',  value: 2 }, { key: 'Tu', value: 3 },
         { key: 'W',  value: 4 }, { key: 'Th', value: 5 }, { key: 'F',  value: 6 },
         { key: 'Sa', value: 7 }];

    days.forEach((day) => {
      if (daysOfWeek.contains(day.value)) {
        set(day, 'isChecked', true);
      }
    });

    set(this, 'days', days);
  },

  // TODO: switch to attrsDidChange
  setDefaultValues: observer('startDate', 'repeats', function() {
    const startDate = get(this, 'startDate');
    const repeats = get(this, 'repeats');
    const daysOfWeek = get(this, 'daysOfWeek');

    if (startDate && repeats === 'monthly') {
      const weekOfMonth = Math.ceil(startDate.getDate()/7)-1;

      set(this, 'weeksOfMonth', [weekOfMonth]);
    }

    const hasDaysOfWeek = (repeats === 'weekly' || repeats === 'bi-weekly');

    if (isEmpty(daysOfWeek) && hasDaysOfWeek) {
      const dayOfWeek = startDate.getDay() + 1;

      run(() => {
        set(this, 'daysOfWeek', [dayOfWeek]);
      });

      this.initDays();
    }
  }),

  checkedDays: computed.filterBy('days', 'isChecked'),

  repeatTypes: computed(() => { return repeatTypes; }),

  daysOfWeek: computed('repeats', 'checkedDays', 'startDate', {
    get() {
      const repeats = get(this, 'repeats');
      const checkedDays = get(this, 'checkedDays').mapBy('value');

      if (repeats === 'daily') {
        return [1,2,3,4,5,6,7];
      } else if (repeats === 'weekly' || repeats === 'bi-weekly') {
        return checkedDays;
      } else if (repeats === 'monthly') {
        const startDate = get(this, 'startDate');

        return [moment(startDate).day()+1];
      } else {
        return [];
      }
    },

    set(key, value) {
      return value;
    }
  }),

  weeklyOrBiWeekly: computed('repeats', function() {
    const repeats = get(this, 'repeats');

    return repeats === 'weekly' || repeats === 'bi-weekly';
  }),

  actions: {
    save() {
      const schedule = get(this, 'schedule');

      const scheduleData = {
        repeats:       get(this, 'repeats'),
        startDate:     get(this, 'startDate'),
        startTime:     get(this, 'startTime'),
        stopDate:      get(this, 'stopDate'),
        stopTime:      get(this, 'stopTime'),
        daysOfWeek:    get(this, 'daysOfWeek'),
        weeksOfMonth:  get(this, 'weeksOfMonth'),
        subtitle:      get(this, 'subtitle'),
        presenterName: get(this, 'presenterName')
      };

      const validations = this.attrs.validate('recurring', scheduleData);

      // TODO: move to model and split apart isValid and errors properties
      if ((typeof validations === 'boolean') && validations) {
        this.attrs.save(schedule, scheduleData);
        this.attrs.cancel();
      } else {
        set(this, 'errors', validations);
      }
    },

    // The daysOfWeek property was not being updated when changing the checked
    // days after the schedule is created. This forces that property to update.
    updateCheckedDays() {
      this.propertyWillChange('checkedDays');
      this.propertyDidChange('checkedDays');
    },

    cancel() {
      const schedule = get(this, 'schedule');

      this.attrs.cancel(schedule);
    },

    selectRepeatType(repeatChoice) {
      set(this, 'repeats', repeatChoice);
    },
  }
});

