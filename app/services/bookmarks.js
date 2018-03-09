import Ember from 'ember';

const { get, set, computed, inject:{service}, Evented, RSVP:{Promise}, isPresent, isBlank } = Ember;

export default Ember.Service.extend(Evented, {
  session: service(),
  store: service(),
  fastboot: service(),

  firstBookmarkComponent: null,
  hasLoadedBookmarks: false,

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
      get(this, 'currentUser').then(currentUser => {
        this._setupTooltip();

        get(this, 'store').query('user', {
            user_id: get(currentUser, 'userId'),
            include: 'bookmarks'
        }).then(() => {
            set(this, 'hasLoadedBookmarks', true);
            this.trigger('bookmarksLoaded');
        });
      });
    }
  },

  _setupTooltip() {
    get(this, 'currentUser').then(currentUser => {
      if (isPresent(get(this, 'firstBookmarkComponent')) && !get(currentUser, 'hasHadBookmarks')) {
        set(this, 'firstBookmarkComponent.showTooltip', true);
      }
    });
  },

  _destroyTooltip() {
    get(this, 'currentUser').then(currentUser => {
      if (isPresent(get(this, 'firstBookmarkComponent')) && !get(currentUser, 'hasHadBookmarks')) {
        set(this, 'firstBookmarkComponent.showTooltip', false);
        this._updateCurrentUser();
      }
    });
  },

  _updateCurrentUser() {
    get(this, 'currentUser').then(currentUser => {
      set(currentUser, 'hasHadBookmarks', true);
      currentUser.save();
    });
  },

  register(bookmarkComponent, method) {
    if (isBlank(get(this, 'firstBookmarkComponent'))) {
      set(this, 'firstBookmarkComponent', bookmarkComponent);
    }

    if (!get(this, 'hasLoadedBookmarks')) {
      this.one('bookmarksLoaded', bookmarkComponent, method);
    } else {
      bookmarkComponent[method]();
    }
  },

  unregister(bookmarkComponent, method) {
    this.off('bookmarksLoaded', bookmarkComponent, method);
  },

  tooltipClosed() {
    this._destroyTooltip();
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
    if (get(this, 'firstBookmarkComponent.showTooltip')) {
      this._destroyTooltip();
    }

    return get(this, 'currentUser').then(currentUser => {
      const newBookmark =  get(this, 'store').createRecord('bookmark', {
        contentId: contentId,
        eventInstanceId: eventInstanceId,
        userId: get(currentUser, 'userId')
      });

      return newBookmark.save();
    });
  },

  removeBookmark(bookmark) {
    this.trigger('bookmarkRemoved', {
      contentId: get(bookmark, 'contentId'),
      eventInstanceId: get(bookmark, 'eventInstanceId')
    });
    return bookmark.destroyRecord();
  },

  bookmarkHasBeenRead(bookmark) {
    set(bookmark, 'read', true);
    return bookmark.save();
  }
});
