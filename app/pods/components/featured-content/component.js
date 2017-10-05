import Ember from 'ember';
import moment from 'moment';

const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'article',
  attributeBindings: ['data-test-featured-content'],
  'data-test-featured-content': computed.oneWay('model.id'),
  classNames: ['FeaturedContent'],
  classNameBindings: ['horizontal:FeaturedContent--horizontal'],
  title: computed.alias('model.title'),
  imageUrl: computed.alias('model.imageUrl'),
  organizationName: computed.alias('model.organization.name'),
  organizationImage: computed.alias('model.organization.logoUrl'),

  contentRoute: computed('model', function() {
    // @TODO: determine correct route from content type
    return 'feed.show';
  }),

  publishedAt: computed('model.publishedAt', function() {
    return moment(get(this, 'model.publishedAt')).fromNow();
  }),

  // untested, and copied from news-card...
  content: computed('model.content', function() {
    let text = this.get('model.content');

    if (text) {
      // Add a space after </p> tags so that they are more readable on the news
      // card once we strip out the HTML. Otherwise there's no space between sentences.
      text = text.replace(/<\/p>/g, '</p> ');

      const tmp = document.createElement("div");

      tmp.innerHTML = text;

      // Remove all HTML tags
      text = tmp.textContent;

      return text;
    }
  })
});
