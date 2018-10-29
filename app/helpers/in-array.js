import { helper as buildHelper } from '@ember/component/helper';

export function inArray(params/*, hash*/) {
  let arry = params[1] || [];
  let item = params[0];

  return arry.includes(item);
}

export default buildHelper(inArray);
