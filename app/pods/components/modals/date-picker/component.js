import { computed, set, get } from '@ember/object';
import ModalInstance from 'subtext-app/pods/components/modal-instance/component';
import moment from 'moment';

export default ModalInstance.extend({
  attributeBindings: ['data-test-modal-datepicker'],
  selectedDate: null,
  sendAfterUpdate: true,

  displayTodayButton: computed('model', {
    get() {
      const { enabledDays } = get(this, 'model');

      return enabledDays ? enabledDays.includes(moment().format('YYYY-MM-DD')) : true;
    }
  }).readOnly(),

  actions: {
    disableDay(day) {
      const { enabledDays } = get(this, 'model');

      if (enabledDays) {
        let {0: firstDay, [enabledDays.length-1]: lastDay } = enabledDays;
        firstDay = moment(firstDay);
        lastDay = moment(lastDay);

        if(moment(day).isBefore(firstDay) || moment(day).isAfter(lastDay)) {
          return false;
        } else {
          return !enabledDays.includes(moment(day).format('YYYY-MM-DD'));
        }
      }
    },

    updateSelected(date) {
      set(this, 'selectedDate', date);

      if (get(this, 'sendAfterUpdate')) {
        this.ok(date);
      }
    },

    returnSelectedDate() {
      this.ok(get(this, 'selectedDate'));
    },

    returnToday() {
      this.ok(moment().format('YYYY-MM-DD'));
    }
  }
});
