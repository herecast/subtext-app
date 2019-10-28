import { helper } from '@ember/component/helper';

export function externalLinkProtocol(params) {
  const url = params[0];

  if (url) {
    const hasProtocol = url.indexOf('http') === 0;

    if (!hasProtocol) {
      return `http://${url}`;
    }
  }

  return params;
}

export default helper(externalLinkProtocol);
