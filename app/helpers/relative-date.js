import Ember from 'ember';
import moment from 'moment';

export function relativeDate(date) {
  const momentDate = (moment.isMoment(date[0])) ? date[0] : moment-from-now(date[0]);
  const daysSincePublished = moment().diff(date, 'days');

  if (daysSincePublished >= 1) {
    return (date) ? date.format('l') : null;
  } else {
    return (date) ? momentDate.fromNow() : null;
  }
}

export default Ember.Helper.helper(relativeDate);
