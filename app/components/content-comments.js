import Ember from 'ember';

export default Ember.Component.extend({
  contentComments: Ember.inject.service('content-comments'),
  comments: [],
  showComments: false,
  scrollTo: null,

  contentTitle: Ember.computed.oneWay('content.title'),
  contentId: Ember.computed.oneWay('content.contentId'),
  commentingDisabled: Ember.computed.oneWay('content.isNew'),

  activeCommentId: function() {
    const scrollTo = this.get('scrollTo');

    if (Ember.isPresent(scrollTo)) {
      return scrollTo.split('-')[1];
    }
  }.property('scrollTo'),

  scrollToComment: function() {
    const scrollTo = this.get('scrollTo');

    if (Ember.isPresent(scrollTo)) {
      const $elem = Ember.$(`[data-anchor="${scrollTo}"]`);
      const offset = ($elem && $elem.offset && $elem.offset()) ? $elem.offset().top : null;

      $elem.addClass('is-active');

      if (offset) {
        Ember.$('body').scrollTop(offset - 100);
      }
    }
  },

  setComments: function() {
    // If the comments have already been set in the route, we don't need
    // to load them again.
    if (Ember.isPresent(this.get('comments'))) {
      return;
    }

    // The content ID will only be available for persisted content, we don't
    // want to try to get comments when creating new content.
    if (this.get('contentId')) {
      this.get('contentComments').getComments(this.get('contentId')).then(comments => {
        this.set('comments', comments.toArray());
      });
    } else {
      this.set('comments', []);
    }
  }.on('didInsertElement'),

  actions: {
    toggleComments() {
      this.toggleProperty('showComments');
    },

    incrementCommentCount() {
      this.get('content').incrementProperty('commentCount');
    },

    triggerScrollToComment() {
      this.scrollToComment();
    }
  }
});
