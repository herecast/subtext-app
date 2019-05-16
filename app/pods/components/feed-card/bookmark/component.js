import { readOnly, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
export default Component.extend({
  classNames: 'FeedCard-Bookmark',
  classNameBindings: ['isBookmarked:bookmarked'],
  'data-test-bookmark': computed('isBookmarked', function() {
    return get(this, 'isBookmarked') ? 'bookmarked' : 'not-bookmarked';
  }),
  'data-test-bookmark-content': readOnly('contentId'),

  store: service(),
  session: service(),
  modals: service(),
  tracking: service(),
  currentService: service('current-controller'),
  bookmarkService: service('bookmarks'),
  currentPath: readOnly('currentService.currentPath'),

  contentId: null,
  eventInstanceId: null,
  bookmark: null,
  justBookmarked: false,

  isLoggedIn: readOnly('session.isAuthenticated'),
  isBookmarked: notEmpty('bookmark'),

  init() {
    this._super(...arguments);
    get(this, 'bookmarkService').register(this, '_updateBookmark');
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, 'bookmarkService').unregister(this, '_updateBookmark');

  },

  _updateBookmark() {
    const contentId = get(this, 'contentId');
    const eventInstanceId = get(this, 'eventInstanceId') || null;

    get(this, 'bookmarkService').checkBookmark(contentId, eventInstanceId)
    .then((bookmark) => {
      if (!get(this, 'isDestroying')) {
        set(this, 'bookmark', bookmark || null);
      }
    });
  },

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to like and save content. It will show up in the heartbeat channel when you go to MyStuff'
    });
  },

  _setBookmark() {
    let bookmark = get(this, 'bookmark');

    if (isBlank(bookmark)) {
      this._trackEvent('CreateBookmark');

      get(this, 'bookmarkService').makeNewBookmark(get(this, 'contentId'), get(this, 'eventInstanceId'))
      .then((bookmark) => {
        set(this, 'bookmark', bookmark);
        set(this, 'justBookmarked', true);
      });
    } else {
      this._trackEvent('RemoveBookmark');

      get(this, 'bookmarkService').removeBookmark(get(this, 'bookmark'))
      .then(() => {
        if (!get(this, 'isDestroying')) {
          set(this, 'bookmark', null);
          set(this, 'justBookmarked', false);
        }
      });
    }
  },

  _trackEvent(eventName) {
    get(this, 'tracking').trackBookmarkEvent(eventName, get(this, 'contentId'), get(this, 'currentPath'));
  },

  actions: {
    clickBookmark() {
      if (!get(this, 'isLoggedIn')) {
        this._trackEvent('UnregisteredClick');
        this._openSignInModal();
      } else {
        this._setBookmark();
      }
    }
  }
});
