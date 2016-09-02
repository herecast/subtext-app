import Ember from 'ember';
import moment from 'moment';
import TrackEvent from 'subtext-ui/mixins/track-event';

const { get, computed, run } = Ember;

export default Ember.Component.extend(TrackEvent, {
  submitDisabled: computed('disabled', 'newComment', function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }),

  keyForFocusReplyBox: 'focus.replyBox',
  keyForBlurReplyBox: 'blur.replyBox',

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
            .closest('.Modal-dialog--fullscreen')
            .addClass('isExpanded')
            .closest('.Modal')
            .scrollTop($elm.position().top);
        });
      });

      $elm.on(get(this, 'keyForBlurReplyBox'), () => {
        $elm
          .closest('.Modal-dialog--fullscreen')
          .removeClass('isExpanded');
      });
    });
  },

  willDestroyElement() {
    this.$().off(get(this, 'keyForFocusReplyBox'));
    this.$().off(get(this, 'keyForBlurReplyBox'));
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

      this.trackEvent('submitContent', {
        navControl: 'Add Comment',
        navControlGroup: 'Add Comment Button'
      });

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
