import Ember from 'ember';

export function inArray(params/*, hash*/) {
  let arry = params[1] || [];
  let item = params[0];

  return arry.includes(item);
}

export default Ember.Helper.helper(inArray);
