import Ember from 'ember';
import TrackCard from 'subtext-ui/mixins/components/track-card';
import computedInitials from 'subtext-ui/utils/computed-initials';
import hexColorFromString from 'subtext-ui/utils/hex-color-from-string';
import dateFormat from 'subtext-ui/lib/dates';

const { get, computed } = Ember;

export default Ember.Component.extend(TrackCard, {
  title: computed.oneWay('talk.title'),
  isContentCard: false,
  isSimilarContent: false,
  outdentAvatar: null,

  attributeBindings:["data-test-talk-card"],
  classNameBindings:['outdentAvatar:Card--avatarOutdented'],
  'data-test-talk-card': computed.oneWay('talk.id'),

  hasComments: computed.gt('talk.commentCount', 0),
  hasViews: computed.gt('talk.viewCount', 0),

  authorInitials: computed('talk.authorName', function() {
    return computedInitials(get(this, 'talk.authorName'));
  }),

  avatarBackgroundColor: computed('talk.authorName', function() {
    return hexColorFromString(get(this, 'talk.authorName'));
  }),

  relativeDate: computed('talk.publishedAt', function() {
    return dateFormat.relative(get(this, 'talk.publishedAt'));
  }),

  isNarrow: computed('isSimilarContent', 'isContentCard', 'media.isSmallDesktop', 'media.isTabletOrSmallDesktop', function() {
    if (this.get('isContentCard')) {
      if (this.get('isSimilarContent')) {
        return this.get('media.isSmallDesktop');
      } else {
        return this.get('media.isTabletOrSmallDesktop');
      }
    }
  }),

  parentContentId: computed('talk.parentContentType', 'talk.parentContentId', 'talk.parentContentType', function() {
    const parentType = this.get('talk.parentContentType');
    if (['event','event-instance','event_instance'].contains(parentType)) {
      return this.get('talk.parentEventInstanceId');
    } else {
      return this.get('talk.parentContentId');
    }
  }),

  commentPluralFriendly: computed('talk.commentCount', function() {
    return (this.get('talk.commentCount') > 1) ? "comments" : "comment";
  }),

  correctAuthorImageUrl: computed('talk.initialCommentAuthorImageUrl', 'talk.authorImageUrl', function() {
    return (this.get('hasComments') === true) ? this.get('talk.initialCommentAuthorImageUrl') : this.get('talk.authorImageUrl');
  }),

  correctAuthorName: computed('talk.authorName', 'talkInitialCommentAuthor', function() {
    return (this.get('hasComments') === true) ? this.get('talk.initialCommentAuthor') : this.get('talk.authorName');
  }),

  actions: {
    onTitleClick() {
      if (this.attrs.onTitleClick) {
        this.attrs.onTitleClick();
      }

      this.sendAction('trackClick', get(this, 'talk'));

      return true;
    },
    trackSimilarContentClick() {
      this.trackEvent('selectSimilarContent', {
        navControl: 'Talk',
        navControlGroup: 'Talk Card',
        sourceContentId: get(this, 'sourceContentId')
      });
    }
  }
});
