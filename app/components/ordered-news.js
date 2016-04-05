import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  news: [],

  orderedNews: computed('news.@each.publishedAt', function () {
    return this.get('news').sortBy('publishedAt').toArray().reverse();
  })
});
