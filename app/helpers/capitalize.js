import { helper as buildHelper } from '@ember/component/helper';
import { capitalize } from '@ember/string';

export function capitalizeHelper(params) {
  const myString = params[0];
  return capitalize(myString);
}

export default buildHelper(capitalizeHelper);
