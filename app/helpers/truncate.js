import { helper as buildHelper } from '@ember/component/helper';

export function truncate(params, hash) {
  const string = params[0];
  const length = hash.length;

  return (string.length >= length) ? `${string.substr(0, length)}...` : string;
}

export default buildHelper(truncate);
