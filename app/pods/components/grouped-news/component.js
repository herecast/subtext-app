import Ember from 'ember';
import moment from 'moment';

const { computed, set, get } = Ember;

function item(number) {
  return computed('orderedNews.[]', function() {
    const objectIndex = number - 1;
    return get(this, 'orderedNews').objectAt(objectIndex);
  });
}

export default Ember.Component.extend({
  news: [],

  lastRefreshDate: null,

  // newsSort: ['publishedAt:desc'],
  orderedNews: computed.sort('news', function(a,b) {
    const momentA = moment(get(a, 'publishedAt')),
      momentB = moment(get(b, 'publishedAt'));

    if (momentA.isBefore(momentB)) {
      return 1;
    } else if (momentA.isAfter(momentB)) {
      return -1;
    }

    return 0;
  }),

  didReceiveAttrs({ newAttrs }) {
    this._super(...arguments);

    if ('news' in newAttrs) {
      set(this, 'lastRefreshDate', moment().format());
    }
  },

  item1: item(1),
  item2: item(2),
  item3: item(3),
  item4: item(4),
  item5: item(5),
  item6: item(6),
  item7: item(7),
  item8: item(8),
  item9: item(9),
  item10: item(10),
  item11: item(11),
  item12: item(12),
  item13: item(13)
});
