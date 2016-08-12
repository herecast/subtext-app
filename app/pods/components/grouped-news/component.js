import Ember from 'ember';

const { computed, observer, run } = Ember;

function item(number) {
  return Ember.computed('orderedNews.[]', function() {
    const objectIndex = number - 1;
    return this.get('orderedNews').objectAt(objectIndex);
  });
}

export default Ember.Component.extend({
  news: [],

  orderedNews: computed('news.@each.publishedAt', function() {
    return this.get('news').sortBy('publishedAt').toArray().reverse();
  }),

  refreshOnReload: observer('news.@each.id', function() {
    // ensure adbanner refreshes when we have new data
    run.once(this, this.rerender);
  }),

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
  item13: item(13),
  item14: item(14)
});
