import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  submitDisabled: function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }.property('disabled', 'newComment'),

  actions: {
    postComment(callback) {
      const content = this.get('newComment');
      let title = this.get('contentTitle');
      if (this.get('contentTitle').indexOf('Re: ') === 1) {
        title = `Re: ${title}`;
      }
      const comment = this.store.createRecord('comment', {
        content: content,
        parentContentId: this.get('parentContentId'),
        title: title,
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
          userImageUrl: this.get('session.currentUser.userImageUrl'),
          userName: this.get('session.currentUser.name')
        });

        if (!this.get('comments')) {
          this.set('comments', []);
        }

        this.get('comments').pushObject(newComment);

        this.set('newComment', null);

        this.sendAction('afterComment');
      });
    }
  }
});
