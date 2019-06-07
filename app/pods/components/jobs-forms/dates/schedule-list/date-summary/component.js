import $ from 'jquery';
import { set, get } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Event-schedule-summary u-layoutPadB10'],

  scheduleSummary: null,

  didInsertElement() {
    this._super(...arguments);
    $(this.element)
    .hide()
    .slideDown(300);
  },

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
      //eslint-disable-next-line ember/closure-actions
      this.sendAction('cancel');
    },

    cancel() {
      set(this, 'isEditing', false);
    }
  }
});
