import { notEmpty } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  parentContentId: DS.attr('number'),
  title: DS.attr('string'),
  userName: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  userId: DS.attr('number'),
  publishedAt: DS.attr('moment-date'),

  hasUserName: notEmpty('userName'),

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
