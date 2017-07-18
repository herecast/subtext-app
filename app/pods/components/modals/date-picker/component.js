import Ember from 'ember';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';
import moment from 'moment';

const { get, set } = Ember;

export default ModalInstance.extend({
  attributeBindings: ['data-test-modal-datepicker'],
  sendAfterUpdate: true,

  actions: {
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
