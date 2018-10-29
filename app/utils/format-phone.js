import { isBlank } from '@ember/utils';

export default function formatPhone(phone) {
  phone = isBlank(phone) ? '' : phone;
  return phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
}
