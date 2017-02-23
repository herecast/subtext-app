import Ember from 'ember';
import moment from 'moment';

export function relativeDate(date) {
  const momentDate = (moment.isMoment(date[0])) ? date[0] : moment(date[0]);
  const daysSincePublished = moment().diff(momentDate, 'days');

  if (daysSincePublished >= 1) {
    return (momentDate) ? momentDate.format('l') : null;
  } else {
    return (momentDate) ? momentDate.fromNow() : null;
  }
}

export default Ember.Helper.helper(relativeDate);
