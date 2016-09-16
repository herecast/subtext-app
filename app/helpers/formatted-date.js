import Ember from 'ember';
import moment from 'moment';

export function formattedDate(params) {
  const date = moment(params[0]);

  return date.format('MMM D, YYYY, h:mm a');
}

export default Ember.Helper.helper(formattedDate);
