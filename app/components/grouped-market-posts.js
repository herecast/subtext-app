import Ember from 'ember';
import { buildGroup } from 'subtext-ui/lib/group-by-date';

export default Ember.Component.extend({
  marketPosts: [],

  groupedPosts: function() {
    const posts = this.get('marketPosts').sortBy('publishedAt');
    const groupBy = 'publishedAt';

    return buildGroup(posts, groupBy, 'dddd, MMMM D', function(date) {
      return date.format('L');
    });
  }.property('marketPosts.@each.publishedAt')
});
