import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

function today() {
  return moment().format(dateFormat);
}

function startOfWeek() {
  return moment().startOf('week').format(dateFormat);
}

function endOfWeek() {
  return moment().endOf('week').format(dateFormat);
}

function startOfWeekend() {
  return moment().endOf('week').format(dateFormat);
}

function endOfWeekend() {
  return moment().endOf('week').add(1, 'day').format(dateFormat);
}

function startOfMonth() {
  return moment().startOf('month').format(dateFormat);
}

function endOfMonth() {
  return moment().endOf('month').format(dateFormat);
}

export default Ember.Component.extend({
  classNames: ['dropdown'],

  showCustomCalendar: false,

  dateSummary: function() {
    const start = this.get('startDate');
    const stop = this.get('stopDate');

    if (start === today() && stop === today()) {
      return 'Today';
    } else if (start === startOfWeek() && stop === endOfWeek()) {
      return 'This Week';
    } else if (start === startOfWeekend() && stop === endOfWeekend()) {
      return 'This Weekend';
    } else if (start === startOfMonth() && stop === endOfMonth()) {
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
        startDate = today();
        stopDate = today();
      } else if (period === 'week') {
        startDate = startOfWeek();
        stopDate = endOfWeek();
      } else if (period === 'weekend') {
        startDate = startOfWeekend();
        stopDate = endOfWeekend();
      } else if (period === 'month') {
        startDate = startOfMonth();
        stopDate = endOfMonth();
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
