import Ember from 'ember';
import MarketCard from './market-card';

export default MarketCard.extend({
  initScrollPositioning: function() {
    const cardPreview = this.$();
    cardPreview.affix({
      offset: {
        top: cardPreview.offset().top - 20
      }
    });
  }.on('didInsertElement'),

  title: function() {
    const title = this.get('post.title');

    if (Ember.isPresent(title)) {
      return title;
    } else {
      return 'A short and informative title';
    }
  }.property('post.title'),
});
