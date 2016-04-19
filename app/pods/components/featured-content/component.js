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
  organizationImage: computed.alias('model.organization.logo'),

  contentUrl: computed('model.id', function() {
    const id = get(this, 'model.id');
    // @TODO: make a helper for determining content url
    //
    return `/news/${id}`;
  }),

  organizationUrl: computed('model.organization.slug', function() {
    const orgSlug = get(this, 'model.organization.slug');

    return `/organizations/${orgSlug}`;
  }),

  publishedAt: computed('model.publishedAt', function() {
    return moment(get('model.publishedAt')).fromNow();
  }),

  // untested, and copied from news-card...
  content: computed('model.content', function() {
    let text = this.get('model.content');

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

});
