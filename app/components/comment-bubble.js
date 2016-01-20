import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(trackEvent, {
  classNames: ['CommentBubble'],
  classNameBindings: ['typeClass'],

  typeClass: function() {
    const type = this.get('type');

    return `CommentBubble--${type}`;
  }.property('type'),

  isNews: Ember.computed.equal('type', 'news'),
  isTalk: Ember.computed.equal('type', 'talk'),
  isEvent: Ember.computed.equal('type', 'event'),

  showCount: function() {
    const count = this.get('count');

    return Ember.isPresent(count) && count > 0;
  }.property('count'),

  commentLabel: function() {
    if (this.get('count') === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }.property('count'),

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
        Ember.$(window).scrollTop(offset - 100);
      }
    }
  }
});
