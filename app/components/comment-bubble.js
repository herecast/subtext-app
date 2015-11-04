import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['CommentBubble'],
  classNameBindings: ['typeClass'],
  mixpanel: Ember.inject.service('mixpanel'),

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

  actions: {
    scrollToComments() {
      const elem = Ember.$('.CommentSection');
      const offset = (elem && elem.offset && elem.offset()) ? elem.offset().top : null;

      if (offset) {
        Ember.$('body').scrollTop(offset - 100);
      }
    },

    trackDiscussionClick() {
      const mixpanel = this.get('mixpanel');
      const currentUser = this.get('session.currentUser');
      const props = {};
      
      Ember.merge(props, mixpanel.getUserProperties(currentUser));
      Ember.merge(props, mixpanel.getNavigationControlProperties('Start Discussion', 'Start Discussion'));
      mixpanel.trackEvent('selectNavControl', props);       
    }
  }
});
