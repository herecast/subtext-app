import Ember from 'ember';
import moment from 'moment';
import Dates from '../lib/dates';

const dateFormat = 'YYYY-MM-DD';

export default Ember.Component.extend({
  classNames: ['dropdown'],

  showCustomCalendar: false,

  dateSummary: function() {
    const start = this.get('startDate');
    const stop = this.get('stopDate');

    if (start === Dates.today() && stop === Dates.today()) {
      return 'Today';
    } else if (start === Dates.startOfWeek() && stop === Dates.endOfWeek()) {
      return 'This Week';
    } else if (start === Dates.startOfWeekend() && stop === Dates.endOfWeekend()) {
      return 'This Weekend';
    } else if (start === Dates.startOfMonth() && stop === Dates.endOfMonth()) {
      return 'This Month';
    } else if (Ember.isPresent(start) && Ember.isPresent(stop)) {
      if (start === stop) {
        return moment(start).format('MMM D');
      } else {
        return `${moment(start).format('MMM D')} - ${moment(stop).format('MMM D')}`;
      }
    }
  }.property('startDate', 'stopDate'),

  actions: {
    setDate(period) {
      let startDate, stopDate;

      if (period === 'today') {
        startDate = Dates.today();
        stopDate = Dates.today();
      } else if (period === 'week') {
        startDate = Dates.startOfWeek();
        stopDate = Dates.endOfWeek();
      } else if (period === 'weekend') {
        startDate = Dates.startOfWeekend();
        stopDate = Dates.endOfWeekend();
      } else if (period === 'month') {
        startDate = Dates.startOfMonth();
        stopDate = Dates.endOfMonth();
      }

      this.setProperties({
        startDate: startDate,
        stopDate: stopDate
      });
    },

    chooseDates() {
      this.set('showCustomCalendar', true);
    },

    afterCustomSelect() {
      const startDate = moment(this.get('customStartDate'));
      const stopDate = moment(this.get('customEndDate'));

      this.setProperties({
        startDate: startDate.format(dateFormat),
        stopDate: stopDate.format(dateFormat),
        showCustomCalendar: false
      });
    }
  }
});
