import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({
  classNames: 'FeedCard-Attribution',
  classNameBindings: ['isOnDetailView:detail-view', 'hideBookmark:no-bookmark:with-bookmark'],

  avatarUrl: null,
  author: null,
  postedTime: null,
  linkRouteName: null,
  linkId: null,
  contentId: null,
  isOnDetailView: false,
  eventInstanceId: null,
  hideBookmark: false,
  noPadding: false,
  customSize: 40,

  hasLinkRouteName: notEmpty('linkRouteName'),

  authorNameFormatted: computed('author', function() {
    const author = get(this, 'author') || '';

    if (author.indexOf('@') >= 0) {
      return author.split('@')[0];
    }

    return author;
  })
});
