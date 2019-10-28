import { notEmpty } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  publishedAt: DS.attr('moment-date'),

  casterName: DS.attr('string'),
  casterAvatarImageUrl: DS.attr('string'),
  casterHandle: DS.attr('string'),
  casterId: DS.attr('number'),

  casterAttributionName: computed('casterName', 'casterHandle', function() {
    if (isPresent(get(this, 'casterName'))) {
      return get(this, 'casterName');
    }

    return `@${get(this, 'casterHandle')}`;
  }),

  casterPageLinkId: computed('casterHandle', function() {
    return `@${get(this, 'casterHandle')}`;
  }),

  hasCasterName: notEmpty('casterAttributionName'),

  parentId: DS.attr('number'),

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
