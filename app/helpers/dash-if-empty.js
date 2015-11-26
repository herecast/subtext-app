import Ember from 'ember';

const { isEmpty } = Ember;

export function dashIfEmpty(params) {
  return isEmpty(params[0]) ? Ember.String.htmlSafe('&mdash;') : params[0];
}

export default Ember.Helper.helper(dashIfEmpty);
