import Ember from 'ember';
import moment from 'moment';

const {
  computed,
  get,
  set,
  run,
  getProperties
} = Ember;

export default Ember.Component.extend({
  news: null,

  canAutosave: computed('isDraft', 'news.hasDirtyAttributes', function() {
    return get(this, 'isDraft') && get(this, 'news.hasDirtyAttributes');
  }),

  status: computed('isDraft', 'isScheduled', 'isPublished', function() {
    const { isDraft, isScheduled, isPublished } = getProperties(this, 'isDraft', 'isScheduled', 'isPublished');

    if (isDraft) {
      return 'draft';
    } else if (isScheduled) {
      return 'scheduled';
    } else if (isPublished) {
      return 'published';
    } else {
      return 'unknown status';
    }
  }),

  isDraft: computed('news.publishedAt', function() {
    return (!get(this, 'news.publishedAt'));
  }),

  isScheduled: computed('news.publishedAt', function() {
    return moment(get(this, 'news.publishedAt')).isAfter(new Date());
  }),

  isPublished: computed('news.publishedAt', function() {
    const publishedAt = get(this, 'news.publishedAt');
    const now = new Date();

    return moment(publishedAt).isBefore(now) || moment(publishedAt).isSame(now);
  }),

  hasUnpublishedChanges: computed('news', 'news.isSaving', 'news.isPublished', 'news.hasDirtyAttributes', function() {
    return get(this, 'isPublished')  && get(this, 'news.hasDirtyAttributes') && (!get(this, 'news.isSaving'));
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

  doAutoSave() {
    if (get(this, 'canAutosave')) {
      // No need for validations
      this._save();
    }
  },

  actions: {
    validateForm() {
      this._validateForm();
    },

    notifyChange() {
      run.debounce(this, this.doAutoSave, 500);
    },

    unpublish() {
      const news = get(this, 'news');

      set(news, 'publishedAt', null);
      this._save();
    },

    publish() {
      const news = get(this, 'news');
      const isValid = this._validateForm();

      if (isValid) {
        if (!get(this, 'isPublished')) {
          set(news, 'publishedAt', moment());
        }
        this._save();
      }
    },

    schedulePublish() {
      const news = get(this, 'news');
      const isValid = this._validateForm();

      if (isValid) {
        set(news, 'publishedAt', moment().add(1, 'day'));
      }
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();
    }
  }
});
