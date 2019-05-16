import { notEmpty, oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: 'FeedCard-Attribution',
  classNameBindings: ['isOnDetailView:detail-view',
                      'showCenter:has-center',
                      'authorOnly:author-only',
                      'authorHasNoSpaces:long-namge-string'],

  model: null,
  hidePostedTime: false,
  linkToDetailIsActive: true,
  hideActivity: false,
  authorOnly: false,
  showCenter: false,
  noPadding: false,
  customSize: 40,
  truncatedAt: false,
  showAnyViewCount: false,

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
    let author = get(this, 'author') || '';
    const truncatedAt = get(this, 'truncatedAt') || false;

    if (author.indexOf('@') >= 0) {
      author = author.split('@')[0];
    }

    if (truncatedAt && author.length >= truncatedAt) {
      author = author.substring(0, truncatedAt - 3) + '...';
    }

    return author;
  })
});
