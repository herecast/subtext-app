import { get, set, computed } from '@ember/object';
import { alias, equal, readOnly, and, gt, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  fastboot: service(),
  infinity: service(),
  session: service(),

  currentUser: readOnly('session.currentUser'),

  model: null,

  activeTab: 'posts',

  showPosts: equal('activeTab', 'posts'),
  showComments: equal('activeTab', 'comments'),
  showAbout: equal('activeTab', 'about'),

  showLiked: equal('activeTab', 'liked'),
  showFollowing: equal('activeTab', 'following'),
  showHiding: equal('activeTab', 'hiding'),

  caster: alias('model.caster'),
  casterId: readOnly('caster.userId'),

  posts: alias('model.posts'),
  hasPosts: gt('posts.length', 0),

  drafts: computed('currentUserIsCaster', function() {
    if (get(this, 'currentUserIsCaster')) {
      const userId = get(this, 'caster.userId') || false;

      if (userId) {
        return this.infinity.model('caster', {
          user_id: userId,
          include: 'contents',
          drafts: true,
          startingPage: 1
        });
      }
    }
  }),
  hasDrafts: gt('drafts.length', 0),

  publishedOrDrafts: 'published',
  publishedIsActive: equal('publishedOrDrafts', 'published'),
  draftsIsActive: equal('publishedOrDrafts', 'drafts'),

  contentsHasCommented: computed('caster.userId', function() {
    const userId = get(this, 'caster.userId') || false;

    if (userId) {
      return this.infinity.model('caster', {
        user_id: userId,
        include: 'contents',
        commented: true,
        startingPage: 1
      });
    }
  }),
  hasCommented: gt('contentsHasCommented.length', 0),
  commentedSortDefinition: Object.freeze(['content.publishedAt:desc']),
  sortedCommentedFeedItems: sort('contentsHasCommented', function(feedItem1, feedItem2) {
    const publishedAt1 = get(feedItem1, 'content.publishedAt');
    const publishedAt2 = get(feedItem2, 'content.publishedAt');
    const diff = publishedAt1.diff(publishedAt2);

    if (diff > 0) {
      return -1;
    } else if (diff < 0){
      return 1;
    }
    return 0;
  }),


  currentUserIsCaster: and('caster.isCurrentUser', 'session.isAuthenticated'),

  liked: computed('currentUserIsCaster', function() {
    if (get(this, 'currentUserIsCaster')) {
      const userId = get(this, 'caster.userId') || false;

      if (userId) {
        return this.infinity.model('caster', {
          user_id: userId,
          include: 'contents',
          liked: true,
          startingPage: 1
        });
      }
    }

    return [];
  }),
  hasLiked: gt('liked.length', 0),

  resetTabs() {
    set(this, 'activeTab', 'posts');
  },

  actions: {
    changeTab(activeTab) {
      set(this, 'activeTab', activeTab);
    },

    onChangePublishedOrDraftsTab(publishedOrDrafts) {
      set(this, 'publishedOrDrafts', publishedOrDrafts);
    }
  }
});
