import Ember from 'ember';
import sanitize from 'npm:sanitize-html';
import moment from 'moment';

const { get, set, computed, isPresent, isBlank, run, inject:{service}, String:{htmlSafe} } = Ember;

export default Ember.Component.extend({
  session: service(),
  modals: service(),
  tracking: service(),
  notify: service('notification-messages'),

  isSavingComment: false,
  commentInFocus: false,

  textareaStyle: null,

  newComment: null,
  maxCommentLength: 255,
  minCommentHeight: 40,
  newCommentLength: computed('newComment.length', function() {
    return get(this, 'newComment.length') || 0;
  }),

  submitDisabled: computed('disabled', 'newComment', function() {
    return get(this, 'disabled') || isBlank(get(this, 'newComment'));
  }),

  _sanitizeComment() {
    const newComment = get(this, 'newComment') || '';
    const sanitizeOptions = {
      allowedTags: [],
      allowedAttributes: [],
      textFilter: (text) => {
        return this._textFilter(text);
      }
    };
    const strippedOfHTML = isPresent(newComment) ? sanitize(newComment, sanitizeOptions) : '';

    if (newComment.length !== strippedOfHTML.length) {
      set(this, 'newComment', strippedOfHTML.trim());
      get(this, 'notify').warning('HTML elements and tags are not allowed in comments.');
    }
  },

  _textFilter(text) {
    const allowedSpecialCharacters = {
       "&quot;": '"',
       "&amp;": '&',
       "&lt;": '<',
       "&gt;": '>'
    };
    const regex = new RegExp(Object.keys(allowedSpecialCharacters).join("|"),"gi");

    return text.replace(regex, function(matched){
      return allowedSpecialCharacters[matched];
    });
  },

  _truncateComment() {
    const newComment = get(this, 'newComment') || '';
    const maxCommentLength = get(this, 'maxCommentLength');

    if (get(this, 'newComment.length') > maxCommentLength) {
      set(this, 'newComment', newComment.substring(0, maxCommentLength));
    }
  },

  _setBoxHeight() {
    const textarea = Ember.$(this.element).find('.CommentSection-replyBox')[0];
    const scrollHeight = textarea.scrollHeight;
    const minCommentHeight = get(this, 'minCommentHeight');
    const newComment = get(this, 'newComment');

    let boxHeight = minCommentHeight;

    if (isPresent(newComment) && scrollHeight > minCommentHeight) {
      boxHeight = scrollHeight;
    }

    set(this, 'textareaStyle', htmlSafe(`height:${boxHeight}px;`));
  },

  actions: {
    trackSubmitClick(buttonDisabled) {
      get(this, 'tracking').trackCommentSubmitButtonClick(buttonDisabled);
    },

    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },

    onFocusIn() {
      set(this, 'commentInFocus', true);
    },
    onFocusOut() {
      set(this, 'commentInFocus', false);
    },

    commentChanging() {
      this._sanitizeComment();
      this._truncateComment();
      run.next(() => {
        this._setBoxHeight();
      });
    },

    checkKeys(textareaEvent) {
      const blockedKeyCodes = [9, 13];

      if (blockedKeyCodes.includes(textareaEvent.keyCode)) {
        textareaEvent.preventDefault();
      }
    },

    postComment() {
      this._sanitizeComment();
      this._truncateComment();

      const content = this.get('newComment');

      if (isBlank(content)) {
        get(this, 'notify').error('You need to have some text in the comment box to leave a comment.');
        return false;
      }

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

        set(this, 'isSavingComment', true);

        comment.save().then(() => {
          set(this, 'showSignInPrompt', false);
          get(this, 'tracking').trackCommentSaved();
          resolve(comment);
        }, reject).finally(() => set(this, 'isSavingComment', false));
      };

      const promise = new Ember.RSVP.Promise((resolve, reject) => {
        if (get(this, 'session.isAuthenticated')) {
          saveComment(resolve, reject);
        } else {
          get(this, 'tracking').trackCommentSignInOrRegisterToPost();
          get(this, 'modals').showModal('modals/sign-in-register', 'sign-in').then(() => {
            this.store.findRecord('current-user', 'self').then(() => {
              saveComment(resolve, reject);
            });
          }, () => {
            get(this, 'tracking').trackCommentDeclinedToAuthenticate();
            set(this, 'showSignInPrompt', true);
            reject();
          }
        );}
      });

      promise.then((comment) => {
        set(this, 'newComment', null);
        this._setBoxHeight();
        this.afterComment(comment);
      });
    }
  }
});
