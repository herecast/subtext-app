import Ember from 'ember';
import moment from 'moment';

const dateFormart = 'YYYY-MM-DD';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  dateSummary: 'This Week',
  showCustomCalendar: false,

  actions: {
    setDate(period) {
      let startDate, stopDate;

      if (period === 'today') {
        startDate = moment();
        stopDate = moment();

        this.set('dateSummary', 'Today');
      } else if (period === 'week') {
        startDate = moment().startOf('week');
        stopDate = moment().endOf('week');

        this.set('dateSummary', 'This Week');
      } else if (period === 'weekend') {
        startDate = moment().endOf('week');
        stopDate = moment().endOf('week').add(1, 'day');

        this.set('dateSummary', 'This Weekend');
      } else if (period === 'month') {
        startDate = moment().startOf('month');
        stopDate = moment().endOf('month');

        this.set('dateSummary', 'This Month');
      }

      this.set('startDate', startDate.format(dateFormart));
      this.set('stopDate', stopDate.format(dateFormart));
    },

    chooseDates() {
      this.set('showCustomCalendar', true);
    },

    afterCustomSelect() {
      const startDate = moment(this.get('customStartDate'));
      const stopDate = moment(this.get('customEndDate'));
      const dateSummary = `${startDate.format('L')} - ${stopDate.format('L')}`;

      this.setProperties({
        startDate: startDate.format(dateFormart),
        stopDate: stopDate.format(dateFormart),
        dateSummary: dateSummary,
        showCustomCalendar: false
      });
    }
  }
});
