import Ember from 'ember';

const { isBlank } = Ember;

export function formattedPhone(params) {
  let phone = params[0];
  phone = isBlank(phone) ? '' : phone;
  return phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}

export default Ember.Helper.helper(formattedPhone);
