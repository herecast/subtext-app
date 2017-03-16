// Importing private utility method broke during upgrade.
// Copied from https://github.com/emberjs/data/blob/master/addon/-private/utils/parse-response-headers.js

import EmptyObject from './empty-object';

const CLRF = '\u000d\u000a';

export default function parseResponseHeaders(headersString) {
  let headers = new EmptyObject();

  if (!headersString) {
    return headers;
  }

  let headerPairs = headersString.split(CLRF);

  headerPairs.forEach((header) => {
    let [field, ...value] = header.split(':');

    field = field.trim();
    value = value.join(':').trim();

    if (value) {
      headers[field] = value;
    }
  });

  return headers;
}
