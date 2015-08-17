import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  submitDisabled: function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }.property('disabled', 'newComment'),

  actions: {
    postComment(callback) {
      const content = this.get('newComment');
      const comment = this.store.createRecord('comment', {
        content: content,
        contentId: this.get('contentId'),
        parentComment: this.get('parentComment'),
        title: `Re: ${this.get('eventTitle')}`,
        userName: this.get('session.currentUser.name')
      });

      const promise = comment.save();

      callback(promise);

      promise.then((comment) => {
        const formattedContent = `<p></p><p>${content}</p><p></p>`;
        const newComment = Ember.Object.create({
          id: comment.get('id'),
          formattedPostedAt: moment().fromNow(),
          content: formattedContent,
          parentComment: comment.get('parentComment'),
          userName: this.get('session.currentUser.name')
        });

        if (!this.get('comments')) {
          this.set('comments', []);
        }

        this.get('comments').pushObject(newComment);

        this.set('newComment', null);
        this.sendAction('afterPost');
      });
    }
  }
});
