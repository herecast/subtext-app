import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  actions: {
    setDate(period) {
      const dateFormart = 'YYYY-MM-DD';
      let startDate, stopDate;

      if (period === 'today') {
        startDate = moment();
        stopDate = moment();
      } else if (period === 'weekend') {
        startDate = moment().endOf('week');
        stopDate = moment().endOf('week').add(1, 'day');
      } else if (period === 'month') {
        startDate = moment().startOf('month');
        stopDate = moment().endOf('month');
      }

      this.set('startDate', startDate.format(dateFormart));
      this.set('stopDate', stopDate.format(dateFormart));
    },

    // TODO Need to implement a custom date picker that lets a user choose the
    // start and stop dates.
    chooseDates() {
      return false;
    }
  }
});
