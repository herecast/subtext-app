import Ember from 'ember';
import moment from 'moment';
import TrackCard from 'subtext-ui/mixins/components/track-card';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  classNames: ['Card', 'NewsCard', 'u-flexColumn'],
  classNameBindings: ['missingContent:hidden'],
  hasImage: Ember.computed.notEmpty('item.imageUrl'),
  isSimilarContent: false,

  missingContent: Ember.computed.empty('item'),

  date: computed('item.publishedAt', function() {
    return moment(this.get('item.publishedAt')).format('L');
  }),

  content: computed('item.content', function() {
    let text = this.get('item.content');

    if (text) {
      // Replace <br> tags with two line breaks so that we can later replace
      // those "double breaks" with <br> tags once all other HTML tags have
      // been removed.
      text = text.replace(/(<br +?\/?>)/g, '\n\n');

      // Add a space after </p> tags so that they are more readable on the news
      // card once we strip out the HTML. Otherwise there's no space between sentences.
      text = text.replace(/<\/p>/g, '</p> ');

      const tmp = document.createElement("div");

      tmp.innerHTML = text;

      // Remove all HTML tags
      text = tmp.textContent;

      // Replace "double breaks" added above with <br> tags so the news card
      // has a line break for new paragraphs.
      text = text.replace('\n\n', '<br>');

      return text;
    }
  }),

  actions: {
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'News',
        navControlGroup: 'News Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
