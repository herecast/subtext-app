import { Promise } from 'rsvp';
import $ from 'jquery';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { isBlank, isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import sanitize from 'npm:sanitize-html';
import moment from 'moment';

export default Component.extend({
  session: service(),
  modals: service(),
  tracking: service(),
  notify: service('notification-messages'),

  parentId: null,

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
    const textarea = $(this.element).find('.CommentSection-replyBox')[0];
    const scrollHeight = textarea.scrollHeight;
    const minCommentHeight = get(this, 'minCommentHeight');
    const newComment = get(this, 'newComment');

    let boxHeight = minCommentHeight;

    if (isPresent(newComment) && scrollHeight > minCommentHeight) {
      boxHeight = scrollHeight;
    }

    set(this, 'textareaStyle', htmlSafe(`height:${boxHeight}px;`));
  },

  _trackSubmitClick(buttonDisabled) {
    get(this, 'tracking').trackCommentSubmitButtonClick(buttonDisabled);
  },

  actions: {
    trackSubmitClick(buttonDisabled) {
      this._trackSubmitClick(buttonDisabled);
    },

    showSignInMenu() {
      get(this, 'modals').showModal('modals/sign-in-register', {
        model: 'sign-in',
        alternateSignInMessage: 'You must be signed in to comment on content.'
      });
    },

    onFocusIn() {
      if (get(this, 'session.isAuthenticated')) {
        set(this, 'commentInFocus', true);
      } else {
        this.send('showSignInMenu');
      }

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
      this._trackSubmitClick();
      this._sanitizeComment();
      this._truncateComment();

      const content = this.get('newComment');

      if (isBlank(content)) {
        get(this, 'notify').error('You need to have some text in the comment box to leave a comment.');
        return false;
      }

      const saveComment = (resolve, reject) => {
        const comment = this.store.createRecord('comment', {
          content,
          parentId: get(this, 'parentId'),
          casterName: get(this, 'session.currentUser.name'),
          casterId: get(this, 'session.currentUser.userId'),
          casterHandle: get(this, 'session.currentUser.handle'),
          casterAvatarImageUrl: get(this, 'session.currentUser.avatarImageUrl'),
          publishedAt: moment()
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

      const promise = new Promise((resolve, reject) => {
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
