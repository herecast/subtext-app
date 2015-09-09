import Ember from 'ember';

export default Ember.Component.extend({
  news: [],

  orderedNews: function () {
    return this.get('news').sortBy('publishedAt').toArray().reverse();
  }.property('news.@each.publishedAt')
});