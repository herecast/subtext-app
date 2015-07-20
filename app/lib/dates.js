import Ember from 'ember';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

export default {
  dateSummary(start, stop) {
    if (start === this.today() && stop === this.today()) {
      return 'Today';
    } else if (start === this.tomorrow() && stop === this.tomorrow()) {
      return 'Tomorrow';
    } else if (start === this.startOfWeek() && stop === this.endOfWeek()) {
      return 'This Week';
    } else if (start === this.startOfWeekend() && stop === this.endOfWeekend()) {
      return 'This Weekend';
    } else if (start === this.startOfMonth() && stop === this.endOfMonth()) {
      return 'This Month';
    } else if (Ember.isPresent(start) && Ember.isPresent(stop)) {
      if (start === stop) {
        return moment(start).format('MMM D');
      } else {
        return `${moment(start).format('MMM D')} - ${moment(stop).format('MMM D')}`;
      }
    }
  },

  today() {
    return moment().format(dateFormat);
  },

  tomorrow() {
    return moment().add(1, 'day').format(dateFormat);
  },

  startOfWeek() {
    return moment().format(dateFormat);
  },

  endOfWeek() {
    return moment().add(6, 'days').format(dateFormat);
  },

  startOfWeekend() {
    return moment().endOf('week').subtract(1, 'day').format(dateFormat);
  },

  endOfWeekend() {
    return moment().endOf('week').add(1, 'day').format(dateFormat);
  },

  startOfMonth() {
    return moment().format(dateFormat);
  },

  endOfMonth() {
    return moment().add(30, 'days').format(dateFormat);
  }
};
