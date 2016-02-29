import Ember from 'ember';
import moment from 'moment';

const { set, run } = Ember;

export default Ember.Controller.extend({
  queryParams: ['startDate','endDate'],
  startDate: null,
  endDate: null,
  setStartDate(date) {
    set(this, 'startDate', date);
  },
  setEndDate(date) {
    set(this, 'endDate', date);
  },
  actions: {
    updateStartDate(date) {
      const startDate = moment(date);

      if(startDate.isValid()) {
        run.debounce(this, this.setStartDate, startDate.format('YYYY-MM-DD'), 500);
      }
    },
    updateEndDate(date) {
      const endDate = moment(date);

      if(endDate.isValid()) {
        run.debounce(this, this.setEndDate, endDate.format('YYYY-MM-DD'), 500);
      }
    }
  }
});
