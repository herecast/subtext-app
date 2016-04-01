import Ember from 'ember';
import moment from 'moment';
import Validation from 'subtext-ui/mixins/components/validation';

const {
  computed,
  isBlank,
  get,
  set,
  run,
  getProperties,
  inject
} = Ember;

export default Ember.Component.extend(Validation, {
  news: null,
  selectedPubDate: null,
  isPickingScheduleDate: false,

  toast: inject.service(),

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

  _clearSchedulePubDate() {
    this.setProperties({
      selectedPubDate: null,
      isPickingScheduleDate: false
    });
  },

  _save() {
    const news = get(this, 'news');

    // TODO why does ember data lose the association
    // to the model after saving
    news.save().then((response) => {
      get(this, 'toast').success('Post successfully saved.');

      set(this, 'news', response);
    });
  },

  validateForm() {
    this.validatePresenceOf('news.title');
    this.validatePresenceOf('news.subtitle');
    this.validateContent();
  },

  validateContent() {
    const content = get(this, 'news.content');

    if (isBlank(content) || content.replace(/<[^>]*>/g, '') === '') {
      set(this, 'errors.content', "News can't be blank.");
    } else {
      set(this, 'errors.content', null);
      delete get(this, 'errors')['content'];
    }
  },

  isValid() {
    const isValid = this._super(...arguments);

    if (!isValid) {
      get(this, 'toast').error('Please fill out all required fields');
    }

    return isValid;
  },

  doAutoSave() {
    if (get(this, 'canAutosave')) {
      // No need for validations
      this._save();
    }
  },

  actions: {
    notifyChange() {
      run.debounce(this, this.doAutoSave, 900);
    },

    unpublish() {
      const news = get(this, 'news');

      set(news, 'publishedAt', null);
      this._save();
    },

    publish() {
      const news = get(this, 'news');

      if (this.isValid()) {
        // TODO should this be a separate action?
        if (!get(this, 'isPublished')) {
          set(news, 'publishedAt', moment());
        }
        this._save();
      }
    },
    schedulePublish() {
      if (this.isValid()) {
        set(this, 'news.publishedAt', get(this, 'selectedPubDate'));

        this._save();
        this._clearSchedulePubDate();
      }
    },
    cancelSchedulePublish() {
      this._clearSchedulePubDate();
    },
    choosePubDate() {
      this.setProperties({
        selectedPubDate: moment().add(1, 'day').milliseconds(0).seconds(0).minutes(0).add(1, 'hour'),
        isPickingScheduleDate: true
      });
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();
    }
  }
});
