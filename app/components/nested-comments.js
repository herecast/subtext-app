import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Comments'],
  session: Ember.inject.service('session'),
  showReplyBox: false,

  sortedComments: function() {
    const comments = this.get('comments');

    if (comments) {
      return comments.sortBy('postedAt').reverse();
    } else {
      return [];
    }
  }.property('comments.@each.postedAt'),

  actions: {
    reply() {
      this.toggleProperty('showReplyBox');
    },

    afterPost() {
      this.set('showReplyBox', false);
    }
  }
});
