import Ember from 'ember';

export function round(params) {
  const num = params[0];
  const places = params[1];
  if (places) {
    return Math.round(num * 10 * places) / (10 * places);
  } else {
    return Math.round(num);
  }
}

export default Ember.Helper.helper(round);
