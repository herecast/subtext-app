import { helper as buildHelper } from '@ember/component/helper';

export function times(params) {
  const num = params[0];
  const num2 = params[1];
  return num * num2;
}

export default buildHelper(times);
