import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { isEmpty } from '@ember/utils';

export function dashIfEmpty(params) {
  return isEmpty(params[0]) ? htmlSafe('&mdash;') : params[0];
}

export default buildHelper(dashIfEmpty);
