import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  showReplyBox: false,

  postedAt: function() {
    return moment(this.get('row.posted_at')).fromNow();
  }.property('row.posted_at'),

  sortedComments: function() {
    const comments = this.get('comments');

    if (comments) {
      return comments.sortBy('posted_at').reverse();
    } else {
      return [];
    }
  }.property('comments.@each.posted_at'),

  actions: {
    reply() {
      this.toggleProperty('showReplyBox');
    },

    afterPost() {
      this.set('showReplyBox', false);
    }
  }
});
