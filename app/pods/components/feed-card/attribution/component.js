import { notEmpty, oneWay, gt } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
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
  showCenter: false,
  noPadding: false,
  customSize: 40,
  minViewCount: 100,
  minCommentCount: 1,

  avatarUrl: oneWay('model.attributionImageUrl'),
  author: oneWay('model.attributionName'),
  postedTime: oneWay('model.publishedAtRelative'),
  linkRouteName: oneWay('model.attributionLinkRouteName'),
  linkId: oneWay('model.attributionLinkId'),
  contentId: oneWay('model.contentId'),
  eventInstanceId: oneWay('model.eventInstanceId'),
  viewCount: oneWay('model.viewCount'),
  commentCount: oneWay('model.commentCount'),

  showViewCount: computed('viewCount', 'minViewCount', function() {
    const viewCount = parseInt(get(this, 'viewCount')) || null;

    return isPresent(viewCount) && viewCount >= get(this, 'minViewCount');
  }),

  showCommentCount: gt('commentCount', 0),

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
