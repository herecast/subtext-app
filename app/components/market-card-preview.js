import Ember from 'ember';
import MarketCard from './market-card';

export default MarketCard.extend({
  title: function() {
    const title = this.get('post.title');

    if (Ember.isPresent(title)) {
      return title;
    } else {
      return 'A short and informative title';
    }
  }.property('post.title'),
});
