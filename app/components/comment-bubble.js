import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const { computed } = Ember;

export default Ember.Component.extend(trackEvent, {
  classNames: ['CommentBubble'],
  classNameBindings: ['typeClass'],

  typeClass: computed('type', function() {
    const type = this.get('type');

    return `CommentBubble--${type}`;
  }),

  isNews: Ember.computed.equal('type', 'news'),
  isTalk: Ember.computed.equal('type', 'talk'),
  isEvent: Ember.computed.equal('type', 'event'),

  showCount: computed('count', function() {
    const count = this.get('count');

    return Ember.isPresent(count) && count > 0;
  }),

  commentLabel: computed('count', function() {
    if (this.get('count') === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }),

  _getTrackingArguments() {
    return {
      navControl: 'Start Discussion'
    };
  },

  actions: {
    scrollToComments() {
      const elem = Ember.$('.CommentSection');
      const offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;

      if (offset) {
        Ember.$('.ember-application > .ember-view').scrollTop(offset - 100);
      }
    }
  }
});
