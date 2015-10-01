import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';

export default Ember.Component.extend({
  marketPosts: [],

  groupedPosts: function() {
    const posts = this.get('marketPosts').sortBy('publishedAt').reverse();
    const groupBy = 'publishedAt';

    return buildGroup(posts, groupBy, 'dddd, MMMM D', function(date) {
      return date.format('L');
    }).toArray().reverse();
  }.property('marketPosts.@each.publishedAt')
});
