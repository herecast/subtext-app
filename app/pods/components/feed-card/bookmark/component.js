import { readOnly, alias, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
export default Component.extend({
  classNames: 'FeedCard-Bookmark',
  classNameBindings: ['isBookmarked:bookmarked', 'hasRead:has-read:has-not-read'],
  'data-test-bookmark': computed('isBookmarked', function() {
    return get(this, 'isBookmarked') ? 'bookmarked' : 'not-bookmarked';
  }),
  'data-test-bookmark-status': computed('isBookmarked', 'hasRead', function() {
    if (get(this, 'isBookmarked')) {
      return get(this, 'hasRead') ? 'read' : 'not-read';
    }
    return null;
  }),
  'data-test-bookmark-content': readOnly('contentId'),


  store: service(),
  session: service(),
  modals: service(),
  tracking: service(),
  currentService: service('current-controller'),
  bookmarkService: service('bookmarks'),
  currentPath: readOnly('currentService.currentPath'),

  isOnDetailView: false,
  showTooltip: false,
  contentId: null,
  eventInstanceId: null,
  bookmark: null,

  isLoggedIn: readOnly('session.isAuthenticated'),
  hasRead: alias('bookmark.read'),
  isBookmarked: notEmpty('bookmark'),


  init() {
    get(this, 'bookmarkService').register(this, '_updateBookmark');

    this._super(...arguments);
  },

  willDestroyElement() {
    get(this, 'bookmarkService').unregister(this, '_updateBookmark');
  },

  _updateBookmark() {
    const contentId = get(this, 'contentId');
    const eventInstanceId = get(this, 'eventInstanceId') || null;

    get(this, 'bookmarkService').checkBookmark(contentId, eventInstanceId)
    .then((bookmark) => {
      if (!get(this, 'isDestroying') && isPresent(bookmark)) {
        set(this, 'bookmark', bookmark);
        this._checkIfBookmarkShouldBeRead(bookmark);
      }
    });
  },

  _checkIfBookmarkShouldBeRead(bookmark) {
    if (!get(this, 'isDestroying')) {
      const isOnDetailView = get(this, 'isOnDetailView');
      const hasRead = get(this, 'hasRead');

      if (isPresent(bookmark) && isOnDetailView && !hasRead) {
        get(this, 'bookmarkService').bookmarkHasBeenRead(bookmark);

        this._trackEvent('ReadBookmark');
      }
    }
  },

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to bookmark content for later viewing. It will show up in the bookmarks channel when you go to MyStuff'
    });
  },

  _setBookmark() {
    let bookmark = get(this, 'bookmark');

    if (isBlank(bookmark)) {
      this._trackEvent('CreateBookmark');

      get(this, 'bookmarkService').makeNewBookmark(get(this, 'contentId'), get(this, 'eventInstanceId'))
      .then((bookmark) => {
        set(this, 'bookmark', bookmark);
      });
    } else {
      this._trackEvent('RemoveBookmark');

      get(this, 'bookmarkService').removeBookmark(get(this, 'bookmark'))
      .then(() => {
        if (!get(this, 'isDestroying')) {
          set(this, 'bookmark', null);
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
    },
    closeTooltip() {
      set(this, 'showTooltip', false);
      get(this, 'bookmarkService').tooltipClosed();
      this._trackEvent('CloseTooltip');
    }
  }
});
