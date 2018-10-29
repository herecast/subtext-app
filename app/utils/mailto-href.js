import { isEmpty } from '@ember/utils';
import { htmlSafe } from '@ember/template';

export default function mailtoHref(email, options) {
  let mailto = '';

  if (!isEmpty(email)) {
    mailto = `mailto:${email}`;

    if (!isEmpty(options)) {
      mailto += '?';

      for (var property in options) {
        mailto += `${property}=${encodeURIComponent(options[property])}&`;
      }

      mailto = mailto.slice(0, -1);
    }
  }

  return htmlSafe(mailto);
}
