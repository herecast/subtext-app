import Ember from 'ember';
import moment from 'moment';

const { set, computed } = Ember;

export default Ember.Component.extend({
  news: [],
  lastRefreshDate: null,

  orderedNews: computed('news.@each.publishedAt', function() {
    return this.get('news').sortBy('publishedAt').toArray().reverse();
  }),

  didReceiveAttrs({ newAttrs }) {
    this._super(...arguments);
    if ('news' in newAttrs) {
      set(this, 'lastRefreshDate', moment().format());
    }
  }
});
