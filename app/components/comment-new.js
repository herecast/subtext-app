import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  submitDisabled: computed('disabled', 'newComment', function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }),

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

      promise.then(() => {
        this.set('newComment', null);
        this.sendAction('afterComment');
      });
    }
  }
});
