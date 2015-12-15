import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  marketPosts: [],

  sortedPosts: computed('marketPosts.@each.publishedAt', function() {
    return this.get('marketPosts').sortBy('publishedAt').reverse();
  })
});
