import Ember from 'ember';

export function times(params) {
  const num = params[0];
  const num2 = params[1];
  return num * num2;
}

export default Ember.Helper.helper(times);
