import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  schedules: A(),

  displayedSchedules: computed('schedules.@each._remove', function() {
    return get(this, 'schedules').rejectBy('_remove');
  }),

  actions: {
    excludeEvent(schedule, trigger, calEvent) {
      if (get(this, 'excludeEvent')) {
        get(this, 'excludeEvent')(schedule, calEvent)
      }
    },
    includeEvent(schedule, trigger, calEvent) {
      if (get(this, 'includeEvent')) {
        get(this, 'includeEvent')(schedule, calEvent)
      }
    }
  }
});
