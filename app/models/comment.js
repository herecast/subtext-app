import Ember from 'ember';
import DS from 'ember-data';

const { get, computed, isPresent } = Ember;

export default DS.Model.extend({
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  parentContentId: DS.attr('number'),
  title: DS.attr('string'),
  userName: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  publishedAt: DS.attr('moment-date'),

  formattedPostedAt: computed('publishedAt', function() {
    const publishedAt = get(this, 'publishedAt');

    return isPresent(publishedAt) ? publishedAt.fromNow() : '';
  }),

  contentStripped: computed('content', function() {
    const content = get(this, 'content');
    const strippedOfHTML = isPresent(content) ? content.replace(/(<([^>]+)>)/ig,"") : '';

    return strippedOfHTML;
  })
});
