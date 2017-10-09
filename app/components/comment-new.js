import Ember from 'ember';
import moment from 'moment';

const { get, set, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  session: service(),
  modals: service(),

  submitDisabled: computed('disabled', 'newComment', function() {
    return this.get('disabled') || Ember.isBlank(this.get('newComment'));
  }),

  actions: {
    postComment() {
      const content = this.get('newComment');
      let title = this.get('contentTitle');

      if (this.get('contentTitle').indexOf('Re: ') === 1) {
        title = `Re: ${title}`;
      }

      const saveComment = (resolve, reject) => {
        const comment = this.store.createRecord('comment', {
          content, title,
          parentContentId: get(this, 'parentContentId'),
          userName: get(this, 'session.currentUser.name'),
          userImageUrl: get(this, 'session.currentUser.userImageUrl'),
          publishedAt: moment() // for ordering multiple new comments after creation. not sent to the api
        });

        if (get(this, 'submitDisabled')) {
          return reject();
        }

        comment.save().then(() => {
          set(this, 'showSignInPrompt', false);
          resolve(comment);
        }, reject);
      };

      const promise = new Ember.RSVP.Promise((resolve, reject) => {
        if (get(this, 'session.isAuthenticated')) {
          saveComment(resolve, reject);
        } else {
          get(this, 'modals').showModal('modals/sign-in-register', 'sign-in').then(() => {
            this.store.findRecord('current-user', 'self').then(() => {
              saveComment(resolve, reject);
            });
          }, () => {
            set(this, 'showSignInPrompt', true);
            reject();
          }
        );}
      });

      promise.then((comment) => {
        set(this, 'newComment', null);
        this.afterComment(comment);
      });
    }
  }
});
