import { notEmpty, oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: 'FeedCard-Attribution',
  classNameBindings: ['isOnDetailView:detail-view',
                      'showCenter:has-center',
                      'authorHasNoSpaces:long-namge-string'],

  model: null,
  hidePostedTime: false,
  linkToDetailIsActive: true,
  hideActivity: false,
  hideBookmark: false,
  showCenter: false,
  noPadding: false,
  customSize: 40,

  avatarUrl: oneWay('model.attributionImageUrl'),
  author: oneWay('model.attributionName'),
  linkRouteName: oneWay('model.attributionLinkRouteName'),
  linkId: oneWay('model.attributionLinkId'),
  contentId: oneWay('model.contentId'),
  eventInstanceId: oneWay('model.eventInstanceId'),

  authorHasNoSpaces: computed('author', function() {
    const author = get(this, 'author') || '';
    return author.indexOf(' ') < 0;
  }),

  hasLinkRouteName: notEmpty('linkRouteName'),

  authorNameFormatted: computed('author', function() {
    const author = get(this, 'author') || '';

    if (author.indexOf('@') >= 0) {
      return author.split('@')[0];
    }

    return author;
  })
});
