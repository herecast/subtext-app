import Ember from 'ember';

import moment from 'moment';

export function formattedDay(params) {
  const date = moment(params[0]);

  return date.format('MMM D, YYYY');
}

export default Ember.Helper.helper(formattedDay);
