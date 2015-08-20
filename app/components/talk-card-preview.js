import Ember from 'ember';
import TalkCard from './talk-card';

export default TalkCard.extend({
  initScrollPositioning: function() {
    const cardPreview = Ember.$('.ContentCardPreview-content');
    cardPreview.affix({
      offset: {
        top: cardPreview.offset().top - 20
      }
    });
  }.on('didInsertElement'),

  title: function() {
    const title = this.get('talk.title');

    if (Ember.isPresent(title)) {
      return title;
    } else {
      return 'A short and informative title';
    }
  }.property('talk.title'),
});
