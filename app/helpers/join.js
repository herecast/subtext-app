import Ember from 'ember';

export function join(params, options) {
  let arry = params[0] || [];
  let delimeter = options['delimeter'] || ' ';

  return arry.join(delimeter);
}

export default Ember.Helper.helper(join);
