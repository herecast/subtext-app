import Component from '@ember/component';
import { set, get } from '@ember/object';
import { run } from '@ember/runloop';

export default Component.extend({
  schedule: null,

  init() {
    this._super(...arguments);
    this.initValues();
  },

  initValues() {
    const schedule = get(this, 'schedule');
    const properties = schedule.getProperties(
      'startDate', 'startTime', 'stopDate', 'stopTime');

    properties.startTime = schedule.getWithDefault('startTime', '09:00 am');
    properties.stopTime = get(schedule, 'stopTime');

    this.setProperties(properties);
  },

  actions: {
    save() {
      const schedule = get(this, 'schedule');
      const stopTime = get(this, 'stopTime');

      if (stopTime === '__:__ _m') {
        run(() => {
          set(this, 'stopTime', null);
        });
      }

      const scheduleData = {
        repeats:       'once',
        startDate:     get(this, 'startDate'),
        startTime:     get(this, 'startTime'),
        stopDate:      get(this, 'startDate'),
        stopTime:      get(this, 'stopTime')
      };

      // TODO: move to model and split apart isValid and errors properties

      const validations = get(this, 'validate')('single', scheduleData);

      if ((typeof validations === 'boolean') && validations) {
        get(this, 'save')(schedule, scheduleData);
        get(this, 'cancel')();
      } else {
        set(this, 'errors', validations);
      }
    },

    cancel() {
      get(this, 'cancel')();
    },

    onCloseModal() {
      if (get(this, 'onCloseModal')) {
        get(this, 'onCloseModal')();
      }
    }
  }
});
