import Ember from 'ember';
import moment from 'moment';

const {get} = Ember;

export default function sortByPublishedAt (a,b) {
  const momentA = moment(get(a, 'publishedAt')),
    momentB = moment(get(b, 'publishedAt'));

  if (momentA.isBefore(momentB)) {
    return 1;
  } else if (momentA.isAfter(momentB)) {
    return -1;
  }

  return 0;
}
