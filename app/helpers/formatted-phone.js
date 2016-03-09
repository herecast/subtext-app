import Ember from 'ember';

export function formattedPhone(params) {
  let phone = params[0];
  return phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

export default Ember.Helper.helper(formattedPhone);
