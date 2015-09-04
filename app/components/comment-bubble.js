import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['CommentBubble'],
  classNameBindings: ['typeClass'],

  typeClass: function() {
    const type = this.get('type');

    return `CommentBubble--${type}`;
  }.property('type'),

  isNews: Ember.computed.equal('type', 'news'),
  isTalk: Ember.computed.equal('type', 'talk'),
  isEvent: Ember.computed.equal('type', 'event'),

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
        Ember.$('body').scrollTop(offset);
      }
    }
  }
});
