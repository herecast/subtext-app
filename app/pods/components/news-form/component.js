import Ember from 'ember';

const {
  computed,
  get,
  set
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

  _save(news) {
    news.save().then((response) => {
      set(this, 'news', response);
    });
  },

  _validateForm() {
    console.log('validating form... not');
    return true;
  },

  actions: {
    autosave() {
    },

    unpublish() {
      const news = get(this, 'news');

      set(news, 'status', 'draft');
      this._save(news);
    },

    publish() {
      const news = get(this, 'news');
      const isValid = this._validateForm();

      if (isValid) {
        set(news, 'status', 'published');
        this._save(news);
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

        this._save(news);
      }
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();
    }
  }
});
