import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  isDisabled: Ember.computed.empty('newComment'),

  actions: {
    postComment(content) {
      const comment = this.store.createRecord('comment', {
        eventInstanceId: this.get('eventInstanceId'),
        parentCommentId: this.get('parentCommentId'),
        content: content
      });

      comment.save().then((comment) => {
        const nestedComment = Ember.Object.create({
          id: comment.get('id'),
          posted_at: moment().toISOString(),
          content: content,
          user_name: this.get('session.currentUser.name')
        });

        if (!this.get('comments')) {
          this.set('comments', []);
        }

        this.get('comments').pushObject(nestedComment);

        this.set('newComment', null);
        this.sendAction('afterPost');
      });
    }
  }
});
