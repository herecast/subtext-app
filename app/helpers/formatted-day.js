import { helper as buildHelper } from '@ember/component/helper';

import moment from 'moment';

export function formattedDay(params) {
  const date = moment(params[0]);

  return date.format('MMM D, YYYY');
}

export default buildHelper(formattedDay);
