import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  schedules: [],

  displayedSchedules: computed('schedules.@each._remove', function() {
    return get(this, 'schedules').rejectBy('_remove');
  }),

  actions: {
    excludeEvent(schedule, trigger, calEvent) {
      const excludeEvent = get(this, 'excludeEvent');
      if (excludeEvent) {
        excludeEvent(schedule, calEvent);
      }
    },
    includeEvent(schedule, trigger, calEvent) {
      const includeEvent = get(this, 'includeEvent');
      if (includeEvent) {
        includeEvent(schedule, calEvent);
      }
    }
  }
});
