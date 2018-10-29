import { helper as buildHelper } from '@ember/component/helper';
import { copy } from '@ember/object/internals';
import { isArray, A } from '@ember/array';

export function copyHelper(params, hash) {
  if(isArray(params[0])) {
    const toArry = params[0].toArray();
    const eArry = A(toArry);

    return copy(eArry, !!hash['deep']);
  } else {
    return copy(params[0], !!hash['deep']);
  }
}

export default buildHelper(copyHelper);
