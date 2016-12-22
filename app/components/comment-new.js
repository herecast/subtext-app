import Ember from 'ember';

const { get, computed, run } = Ember;

export default Ember.Component.extend({
  submitDisabled: computed('disabled', 'newComment', function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }),

  keyForFocusReplyBox: 'focus.replyBox',

  didInsertElement() {
    this._super(...arguments);

    // Annoying iOS bug: keyboard covers text area when in full screen modal
    // This is fixed by adding 200px to the bottom of the modal and scrolling to the text area on focus
    run.next(this, function() {
      const $this = this.$();
      const $elm = $this.find('.CommentSection-replyBox');
      $elm.on(get(this, 'keyForFocusReplyBox'), () => {
        run.next(this, function() {
          $elm
            .closest('.Modal')
            .scrollTop($elm.position().top);
        });
      });
    });
  },

  willDestroyElement() {
    this.$().off(get(this, 'keyForFocusReplyBox'));
  },

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
