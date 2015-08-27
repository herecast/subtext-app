import Ember from 'ember';
import { buildGroup } from 'subtext-ui/models/concealed-group';

export default Ember.Component.extend({
  talks: [],

  groupedTalks: function() {
    const talks = this.get('talks').sortBy('publishedAt');
    const groupBy = 'publishedAt';

    return buildGroup(talks, groupBy, 'dddd, MMMM D', function(date) {
      return date.format('L');
    });
  }.property('talks.@each.publishedAt')
});