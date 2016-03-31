import Ember from 'ember';

const {
  computed,
  get,
  set,
  run: { throttle }
} = Ember;

export default Ember.Component.extend({
  news: null,

  canAutosave: computed('news', 'news.hasDirtyAttributes', function() {
    return (get(this, 'news.status') === 'draft') && get(this, 'news.hasDirtyAttributes');
  }),

  isDraft: computed('news.status', function() {
    return (get(this, 'news.status') === 'draft');
  }),

  isScheduled: computed('news.status', function() {
    return (get(this, 'news.status') === 'scheduled');
  }),

  isPublished: computed('news.status', function() {
    return (get(this, 'news.status') === 'published');
  }),

  hasUnpublishedChanges: computed('news', 'news.isPublished', 'news.hasDirtyAttributes', function() {
    return get(this, 'isPublished')  && get(this, 'news.hasDirtyAttributes');
  }),

  _save() {
    const news = get(this, 'news');

    news.save().then((response) => {
      set(this, 'news', response);
    });
  },

  _validateForm() {
    console.log('validating form... not');
    return true;
  },

  actions: {
    validateForm() {
      this._validateForm();
    },

    notifyChange() {
      // TODO this is currently NOT working
      Ember.run.debounce(() => {
        if (get(this, 'canAutosave')) {
          const myContext = this;
          const autosave = get(this, '_save');
          // We don't need to validate because autosave
          // can only happen in draft mode
          Ember.run.throttle(myContext, autosave, 500);
        }
      }, 500);
    },

    unpublish() {
      const news = get(this, 'news');

      set(news, 'status', 'draft');
      this._save();
    },

    publish() {
      const news = get(this, 'news');
      const isValid = this._validateForm();

      if (isValid) {
        set(news, 'status', 'published');
        this._save();
      }
    },

    schedulePublish(pubdate) {
      const news = get(this, 'news');
      const isValid = this._validateForm();

      if (isValid) {
        news.setProperties({
          status: 'scheduled',
          published_at: pubdate
        });

        this._save();
      }
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();
    }
  }
});
