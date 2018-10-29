import { helper as buildHelper } from '@ember/component/helper';

export function indefiniteArticle(params/*, hash*/) {
  var str = params[0];

  if (!str || !str.length) {
    return 'a';
  }

  return (['a','e','i','o','u'].indexOf(str.charAt(0).toLowerCase()) === -1) ? 'a' : 'an';
}

export default buildHelper(indefiniteArticle);
