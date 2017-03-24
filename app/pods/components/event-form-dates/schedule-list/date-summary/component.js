import Ember from 'ember';

const { get, set, on } = Ember;

export default Ember.Component.extend({
  classNames: ['Event-schedule-summary u-layoutPadB10'],

  scheduleSummary: null,

  animateIn: on('didInsertElement', function() {
    this.$()
      .hide()
      .slideDown(300);
  }),

  animateOut: on('willDestroyElement', function() {
    // TODO animate destroy
  }),

  actions: {
    remove: function() {
      const schedule = get(this, 'schedule');

      const remove = get(this, 'remove');
      if (remove) {
        remove(schedule);
      }
    },

    save(schedule, scheduleData) {
      const save = get(this, 'save');
      if (save) {
        save(schedule, scheduleData);
      }
      this.sendAction('cancel');
    },

    cancel() {
      set(this, 'isEditing', false);
    }
  }
});
