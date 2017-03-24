import Ember from 'ember';

const { computed, isPresent, get } = Ember;

export default Ember.Component.extend({
  contentComments: Ember.inject.service('content-comments'),
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

  // Using computed.oneWay so comments can be passed into component
  comments: computed.oneWay('contentsQuery'),

  // Query will run again when contentId changes or the # of expected comments increases
  contentsQuery: computed('contentId', 'content.commentCount', function() {
    const contentId = get(this, 'contentId'),
      contentComments = get(this, 'contentComments');

    return isPresent(contentId) ? contentComments.getComments(contentId) : [];
  }),

  scrollToComment: function() {
    const anchor = this.get('scrollToAnchor');

    if (Ember.isPresent(anchor)) {
      const $elem = this.$(`[data-anchor="${anchor}"]`);
      const offset = ($elem && $elem.offset && $elem.offset()) ? $elem.offset().top : null;

      $elem.addClass('is-active');

      if (offset) {
        const scrollTo = get(this, 'scrollTo');
        if (scrollTo) {
          scrollTo(offset - 100);
        }
      }
    }
  },

  actions: {
    incrementCommentCount() {
      this.get('content').incrementProperty('commentCount');
    },

    triggerScrollToComment() {
      this.scrollToComment();
    }
  }
});
