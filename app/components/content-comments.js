import Ember from 'ember';

const { computed, on } = Ember;

export default Ember.Component.extend({
  contentComments: Ember.inject.service('content-comments'),
  comments: [],
  scrollToAnchor: null,
  displayPromotion: false,

  contentTitle: Ember.computed.oneWay('content.title'),
  contentId: Ember.computed.oneWay('content.contentId'),
  commentingDisabled: Ember.computed.oneWay('content.isNew'),

  activeCommentId: computed('scrollToAnchor', function() {
    const anchor = this.get('scrollToAnchor');

    if (Ember.isPresent(anchor)) {
      return anchor.split('-')[1];
    }
  }),

  scrollToComment: function() {
    const anchor = this.get('scrollToAnchor');

    if (Ember.isPresent(anchor)) {
      const $elem = this.$(`[data-anchor="${anchor}"]`);
      const offset = ($elem && $elem.offset && $elem.offset()) ? $elem.offset().top : null;

      $elem.addClass('is-active');

      if (offset) {
        this.attrs.scrollTo(offset - 100);
      }
    }
  },

  setComments: on('didInsertElement', function() {
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
  }),

  actions: {
    incrementCommentCount() {
      this.get('content').incrementProperty('commentCount');
    },

    triggerScrollToComment() {
      this.scrollToComment();
    }
  }
});
