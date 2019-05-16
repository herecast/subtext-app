import { computed, set, get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { Promise } from 'rsvp';
import { isBlank, isPresent } from '@ember/utils';

export default Service.extend(Evented, {
  session: service(),
  store: service(),
  fastboot: service(),

  thirdBookmarkComponent: null,
  hasLoadedBookmarks: false,
  bookmarkCount: 0,

  bookmarks: computed(function() {
    return get(this, 'store').peekAll('bookmark');
  }),

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);
    get(this, 'session').on('authenticationSucceeded', this, '_getBookmarks');
    this._getBookmarks();
  },

  _getBookmarks() {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      set(this, 'bookmarkCount', 0);

      get(this, 'currentUser').then(currentUser => {
        get(this, 'store').query('user', {
          user_id: get(currentUser, 'userId'),
          include: 'bookmarks'
        })
        .then(() => {
          set(this, 'hasLoadedBookmarks', true);
          this.trigger('bookmarksLoaded');
        });
      });
    }
  },

  _updateCurrentUser() {
    get(this, 'currentUser').then(currentUser => {
      set(currentUser, 'hasHadBookmarks', true);
      currentUser.save();
    });
  },

  _increaseBookmarkCount() {
    const bookmarkCount = get(this, 'bookmarkCount');
    set(this, 'bookmarkCount', bookmarkCount + 1);
  },

  register(bookmarkComponent, method) {
    if (isBlank(get(this, 'thirdBookmarkComponent')) && parseInt(get(this, 'bookmarkCount')) === 2) {
      set(this, 'thirdBookmarkComponent', bookmarkComponent);
    }

    this._increaseBookmarkCount();

    if (!get(this, 'hasLoadedBookmarks')) {
      this.one('bookmarksLoaded', bookmarkComponent, method);
    } else {
      bookmarkComponent[method]();
    }

    this.on('bookmarksUpdated', bookmarkComponent, method);
  },

  unregister(bookmarkComponent, method) {
    const isThirdBookmarkComponent = get(bookmarkComponent, 'contentId') === get(this, 'thirdBookmarkComponent.contentId');

    if (isThirdBookmarkComponent) {
      set(this, 'thirdBookmarkComponent', null);
    }
    this.off('bookmarksLoaded', bookmarkComponent, method);

    this.off('bookmarksUpdated', bookmarkComponent, method);
  },

  checkBookmark(contentId) {
    return new Promise((resolve) => {
      const bookmarks = get(this, 'bookmarks') || [];

      if (isPresent(bookmarks)) {
        const matchingBookmark = bookmarks.find(bookmark => {
          return parseInt(get(bookmark,'contentId')) === parseInt(contentId);
          //For initial phase of prototype we are only checking contentId
          //At some later point we will allow multiple bookmarks per contentId with different eventInstanceIds
          //API blocks multiple bookmarks with same contentId: until event-instance consolidation
        });
        resolve(matchingBookmark);
      }
      resolve(null);
    });

  },

  makeNewBookmark(contentId, eventInstanceId=null) {
    return get(this, 'currentUser').then(currentUser => {
      const newBookmark =  get(this, 'store').createRecord('bookmark', {
        contentId: contentId,
        eventInstanceId: eventInstanceId,
        userId: get(currentUser, 'userId')
      });

      return newBookmark.save()
      .then((bookmark) => {
        this.trigger('bookmarksUpdated');
        return bookmark;
      });
    });
  },

  removeBookmark(bookmark) {
    this.trigger('bookmarkRemoved', {
      contentId: get(bookmark, 'contentId'),
      eventInstanceId: get(bookmark, 'eventInstanceId')
    });

    return bookmark.destroyRecord()
    .then(() => {
      this.trigger('bookmarksUpdated');
      return null;
    });
  }
});
