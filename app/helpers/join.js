import { helper as buildHelper } from '@ember/component/helper';

export function join(params, options) {
  let arry = params[0] || [];
  let delimeter = options['delimeter'] || ' ';

  return arry.join(delimeter);
}

export default buildHelper(join);
