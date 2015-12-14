import Ember from 'ember';

export function truncate(params, hash) {
  const string = params[0];
  const length = hash.length;

  return (string.length >= length) ? `${string.substr(0, length)}...` : string;
}

export default Ember.Helper.helper(truncate);
