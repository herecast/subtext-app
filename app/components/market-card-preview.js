import Ember from 'ember';
import MarketCard from './market-card';
import PreviewScroll from '../mixins/components/card-preview-scroll';

export default MarketCard.extend(PreviewScroll, {
  title: function() {
    const title = this.get('post.title');

    if (Ember.isPresent(title)) {
      return title;
    } else {
      return 'A short and informative title';
    }
  }.property('post.title'),
});
