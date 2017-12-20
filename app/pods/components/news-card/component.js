import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';
import moment from 'moment';
import dateFormat from 'subtext-ui/lib/dates';
import cheerio from 'npm:cheerio';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  'data-test-component': 'NewsCard',
  'data-test-content': computed.reads('item.id'),
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

  linkRoute: computed.alias('item.organization.organizationLinkRoute'),

  linkId: computed('item.organization.organizationLinkId'),

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

      // Convert html text into cheerio/jquery element and remove image captions
      const $element = cheerio('<div/>').html(text);
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
      const onTitleClick = get(this, 'onTitleClick');
      if (onTitleClick) {
        onTitleClick();
      }
      this.send('trackClick');

      return true;
    },

    trackClick() {
      const clickAction = get(this, 'trackClick');
      if(clickAction) {
        clickAction();
      }

      return true;
    }
  }
});
