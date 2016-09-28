import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';
import moment from 'moment';
import dateFormat from 'subtext-ui/lib/dates';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  tagName: 'article',

  attributeBindings: ['data-test-news-card'],
  'data-test-news-card': computed.oneWay('item.title'),

  classNames: ['Card'],
  classNameBindings: ['missingContent:hidden', 'isVertical:Card--vertical'],
  isVertical: computed('variant', 'item', function() {
    return get(this, 'variant') === 'vertical';
  }),
  hasImage: Ember.computed.notEmpty('item.imageUrl'),
  isSimilarContent: false,
  relativeDate: computed('item.publishedAt', function() {
    return dateFormat.relative(get(this, 'item.publishedAt'));
  }),

  missingContent: computed.empty('item'),

  date: computed('item.publishedAt', function() {
    return moment(get(this, 'item.publishedAt')).format('L');
  }),

  content: computed('item.content', function() {
    let text = get(this, 'item.content');

    if (text) {
      // Replace <br> tags with two line breaks so that we can later replace
      // those "double breaks" with <br> tags once all other HTML tags have
      // been removed.
      text = text.replace(/(<br +?\/?>)/g, '\n\n');

      // Add a space after </p> tags so that they are more readable on the news
      // card once we strip out the HTML. Otherwise there's no space between sentences.
      text = text.replace(/<\/p>/g, '</p> ');

      // Convert html text into jquery element and remove image captions
      const $element = Ember.$('<div/>').html(text);
      $element.find('.ContentImage p').remove();

      // Remove all HTML tags
      text = $element.text();

      // Replace "double breaks" added above with <br> tags so the news card
      // has a line break for new paragraphs.
      text = text.replace('\n\n', '<br>');

      return text;
    }
  }),

  actions: {
    onTitleClick() {
      if (this.attrs.onTitleClick) {
        this.attrs.onTitleClick();
      }
      return true;
    }
  }
});
