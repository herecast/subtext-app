import Ember from 'ember';
import formatBusinessHours from 'subtext-ui/utils/business-hours-format';

export function businessHours(params) {
  //params must be an array and each one must have the | divider in it
  let hours_array = Ember.isArray(params) ? formatBusinessHours(params[0]) : [];

  return hours_array;
}

export default Ember.Helper.helper(businessHours);
