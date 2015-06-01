import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

export default {
  today() {
    return moment().format(dateFormat);
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
