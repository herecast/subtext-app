import { notEmpty, oneWay } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: 'FeedCard-Attribution',
  classNameBindings: ['isOnDetailView:detail-view', 'showCenter:has-center', 'authorHasNoSpaces:long-namge-string'],

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

  showCommentCount: notEmpty('commentCount'),

  authorHasNoSpaces: computed('author', function() {
    const author = get(this, 'author') || '';

    return author.indexOf(' ') > 0;
  }),

  hasLinkRouteName: notEmpty('linkRouteName'),

  viewCountFormatted: computed('viewCount', function() {
    const viewCount = parseInt(get(this, 'viewCount'));

    if (viewCount >= get(this, 'minViewCount')) {
      return this._formatCount(viewCount);
    }

    return '';
  }),

  commentCountFormatted: computed('commentCount', function() {
    const commentCount = parseInt(get(this, 'commentCount'));

    if (commentCount >= get(this, 'minCommentCount')) {
      return this._formatCount(commentCount);
    }

    return '';
  }),

  authorNameFormatted: computed('author', function() {
    const author = get(this, 'author') || '';

    if (author.indexOf('@') >= 0) {
      return author.split('@')[0];
    }

    return author;
  }),

  _formatCount(commentCount) {
    const commentInt = parseInt(commentCount);
    let commentCountString = commentInt.toString();

    if (commentInt >= 1000 && commentInt < 10000) {
      commentCountString = commentCountString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    } else if (commentInt >=10000 && commentInt < 100000) {
      commentCountString = (commentInt / 1000).toFixed(1) + ' K';
    } else if (commentInt >= 100000) {
      commentCountString = (commentInt / 1000).toFixed(0) + ' K';
    }

    return commentCountString
  }
});
