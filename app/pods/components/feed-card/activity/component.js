import { get, computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import ScrollToComments from 'subtext-ui/mixins/components/scroll-to-comments';
import Component from '@ember/component';

export default Component.extend(ScrollToComments, {
  classNames: ['FeedCard-Activity'],

  model: null,
  linkToDetailIsActive: true,

  hideActivity: false,
  hidePostedTime: false,

  minViewCount: 100,
  minCommentCount: 1,

  viewCount: oneWay('model.viewCount'),
  commentCount: oneWay('model.commentCount'),
  postedTime: oneWay('model.publishedAtRelative'),

  showViewCount: computed('viewCount', 'minViewCount', function() {
    const viewCount = parseInt(get(this, 'viewCount')) || null;

    return isPresent(viewCount) && viewCount >= get(this, 'minViewCount');
  }),

  showCommentCount: computed('commentCount', 'minCommentCount', function() {
    const commentCount = parseInt(get(this, 'commentCount')) || null;

    return isPresent(commentCount) && commentCount >= get(this, 'minCommentCount');
  }),

  actions: {
    clickOnCommentBubble() {
      if (get(this, 'linkToDetailIsActive')) {
        return true;
      } else {
        this.scrollToComments();
      }
    }
  }
});
