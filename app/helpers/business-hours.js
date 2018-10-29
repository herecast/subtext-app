import { helper as buildHelper } from '@ember/component/helper';
import { isArray } from '@ember/array';
import formatBusinessHours from 'subtext-ui/utils/business-hours-format';

export function businessHours(params) {
  //params must be an array and each one must have the | divider in it
  let hours_array = isArray(params) ? formatBusinessHours(params[0]) : [];

  return hours_array;
}

export default buildHelper(businessHours);
