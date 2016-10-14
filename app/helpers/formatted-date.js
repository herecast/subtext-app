import Ember from 'ember';
import moment from 'moment';

export function formattedDate(params) {
  const date = moment(params[0]);
  const format = params.length > 1 ? params[1] : 'MMM D, YYYY, h:mm a';

  return date.format(format);
}

export default Ember.Helper.helper(formattedDate);
