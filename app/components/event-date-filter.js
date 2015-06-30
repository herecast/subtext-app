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

    return Dates.dateSummary(start, stop);
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

      Ember.run.later(() => {
        Ember.$('html').on('click.close-calendar', (e) => {
          const calendarEl = this.$()[0];
          const clickEl = Ember.$(e.target)[0];
          const clickedInCalendar = Ember.$.contains(calendarEl, clickEl);

          if (!clickedInCalendar) {
            this.send('closeCalendar');
          }
        });
      }, 100);
    },

    closeCalendar() {
      this.set('showCustomCalendar', false);
      Ember.$('html').off('click.close-calendar');
    },

    afterCustomSelect() {
      const startDate = moment(this.get('customStartDate'));
      const stopDate = moment(this.get('customEndDate'));

      this.setProperties({
        startDate: startDate.format(dateFormat),
        stopDate: stopDate.format(dateFormat)
      });

      this.send('closeCalendar');
    }
  }
});
