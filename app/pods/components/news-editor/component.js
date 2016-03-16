import Ember from 'ember';
import moment from 'moment';
import Validation from 'subtext-ui/mixins/components/validation';
import ajax from 'ic-ajax';
import config from './../../../config/environment';

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

  editorConfig: [
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['insert', ['link']],
    ['para', ['ul', 'ol']],
    ['insert', ['picture', 'link', 'video']]
  ],

  toast: inject.service(),

  organizations: computed.oneWay('session.currentUser.managed_organizations'),
  didOrgChange: false,

  canAutosave: computed('isDraft', 'news.hasDirtyAttributes', 'didOrgChange', function() {
    const hasDirtyAttributes = get(this, 'news.hasDirtyAttributes'),
      orgChanged = get(this, 'didOrgChange');

    return get(this, 'isDraft') && (hasDirtyAttributes || orgChanged);
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

  hasUnpublishedChanges: computed('news', 'news.isSaving', 'news.isPublished', 'news.isScheduled', 'news.hasDirtyAttributes', 'didOrgChange', function() {
    const isScheduledOrPublished = (get(this, 'isPublished') || get(this, 'isScheduled'));

    return isScheduledOrPublished &&
      (get(this, 'news.hasDirtyAttributes') || get(this, 'didOrgChange')) &&
      (!get(this, 'news.isSaving'));
  }),

  filteredOrganizations: computed('organizations.@each.can_publish_news', function() {
    return get(this, 'organizations').filter((item) => {
      return get(item, 'can_publish_news');
    });
  }),

  _clearSchedulePubDate() {
    this.setProperties({
      selectedPubDate: null,
      isPickingScheduleDate: false
    });
  },

  _save() {
    const news = get(this, 'news');

    news.save().then(() => {
      set(this, 'didOrgChange', false);
    });
  },

  validateForm() {
    this.validatePresenceOf('news.title');
    this.validatePresenceOf('news.subtitle');
    this.validateContent();
    this.validateOrganization();
  },

  validateOrganization() {
    const canPublishNews = get(this, 'news.organization.can_publish_news');

    if (canPublishNews) {
      set(this, 'errors.organization', null);
      delete get(this, 'errors')['organization'];
    } else {
      set(this, 'errors.organization', 'A valid Organization is required');
    }
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

    changeOrganization(organization) {
      set(this, 'news.organization', organization);
      set(this, 'didOrgChange', true);

      this.send('notifyChange');
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();
    },

    saveImage(file, callback) {
      const url = `${config.API_NAMESPACE}/images`;
      const data = new FormData();

      data.append('image', {
        image: file,
        primary: 0,
        content_id: 500
      });

      const promise = ajax(url, {
        data: data,
        type: 'POST',
        primary: 0,
        contentType: false,
        processData: false
      });

      callback(promise);

      promise.then(response => {
        alert('this should happen first');
        get(this, 'news.images').push(response.image);
      }).catch(response => {
        if (response.jqXHR.status === 422) {
          const responseJSON = response.jqXHR.responseJSON;

          set(this, 'errorMessage', responseJSON['messages'][0]);
        }
      });
    },
  }
});
