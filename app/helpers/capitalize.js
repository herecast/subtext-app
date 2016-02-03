import Ember from 'ember';

export function capitalize(params) {
  const myString = params[0];
  return Ember.String.capitalize(myString);
}

export default Ember.Helper.helper(capitalize);
