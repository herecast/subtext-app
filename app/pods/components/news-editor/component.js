import Ember from 'ember';
import moment from 'moment';
import Validation from 'subtext-ui/mixins/components/validation';

const {
  computed,
  isBlank,
  isPresent,
  get,
  getProperties,
  setProperties,
  set,
  run,
  inject
  } = Ember;

export default Ember.Component.extend(Validation, {
  classNames: ['NewsEditor'],

  showDevFlags: false,
  news: null,
  showPreview: false,
  //note need to change logic here
  authorOverrideEnabled: computed(function() {
    const authorName = get(this, 'news.authorName');
    return authorName !== get(this, 'currentUser.name') && (isPresent(authorName) || authorName === null);
  }),
  hasAuthorName: computed.notEmpty('news.authorName'),

  authorName() {
    if ( get(this, 'authorOverrideEnabled') ) {
      return get(this, 'news.authorName');
    } else {
      return get(this, 'currentUser.name');
    }
  },

  editorHeight: computed(function() {
    return get(this, 'media.isMobile') ? 300 : 500;
  }),
  selectedPubDate: null,
  isPickingScheduleDate: false,
  api: inject.service(),
  toast: inject.service(),

  pendingFeaturedImage: null,

  currentUser: computed.alias('session.currentUser'),

  // flag to notify summer note to update the editor contents
  // otherwise, updates to content are ignored due to a bug in summer note
  // which causes the cursor to jump
  updateContent: false,

  editorConfig: [
    ['style', ['subtextStyleButtonMenu', 'bold', 'italic', 'underline', 'clear']],
    ['insert', ['link']],
    ['para', ['ul', 'ol']],
    ['insert', ['subtextImageModal', 'video']]
  ],

  editorPopover: {
    image: [
      ['imagesize', ['subtextImageSize100', 'subtextImageSize50', 'subtextImageSize25']],
      ['float', ['subtextFloatLeft', 'subtextFloatNone', 'subtextFloatRight']],
      ['remove', ['subtextRemoveMedia']]
    ],
    link: [
      ['link', ['linkDialogShow', 'unlink']]
    ]
  },

  organizations: computed.oneWay('session.currentUser.managed_organizations'),

  hasUnpublishedChanges: computed('news{hasUnpublishedChanges,pendingFeaturedImage}', 'pendingFeaturedImage', function() {
    return get(this, 'news.hasUnpublishedChanges') || get(this, 'pendingFeaturedImage');
  }),

  canAutosave: computed('news.isDraft', 'news.hasDirtyAttributes', 'news.didOrgChange', 'pendingFeaturedImage', function() {
    const hasDirtyAttributes = get(this, 'news.hasDirtyAttributes'),
      orgChanged = get(this, 'news.didOrgChange'),
      pendingFeaturedImage = get(this, 'pendingFeaturedImage');

    return get(this, 'news.isDraft') && (hasDirtyAttributes || orgChanged || pendingFeaturedImage);
  }),

  status: computed('news.isDraft', 'news.isScheduled', 'news.publishedAt', function() {
    if (get(this, 'news.isDraft')) {
      return 'Draft';
    } else if (get(this, 'news.isScheduled')) {
      return 'Scheduled';
    } else if (get(this, 'news.isPublished')) {
      return 'Published';
    } else {
      return 'Unknown status';
    }
  }),

  filteredOrganizations: computed('organizations.@each.canPublishNews', function() {
    return get(this, 'organizations').filter((item) => {
      return get(item, 'canPublishNews');
    });
  }),

  showPreviewLink: computed('news{publishedAt,isDraft,isScheduled,isPublished,hasUnpublishedChanges,pendingFeaturedImage}', 'pendingFeaturedImage', function() {
    const news = get(this, 'news');

    return get(news, 'hasUnpublishedChanges');
  }),

  _clearSchedulePubDate() {
    this.setProperties({
      selectedPubDate: null,
      isPickingScheduleDate: false
    });
  },

  _save() {
    const news = get(this, 'news');

    set(this, 'news.authorName', this.authorName());

    return news.save().then(() => {
      set(this, 'news.didOrgChange', false);

      const featuredImage = get(this, 'pendingFeaturedImage');

      if (featuredImage) {
        set(this, 'pendingFeaturedImage', null);
        const { file, caption } = getProperties(featuredImage, 'file', 'caption');
        let promise;

        if (file) {
          promise = this._saveImage(file, 1, caption);
        } else {
          const imageID = get(this, 'news.bannerImage.id');

          promise = get(this, 'api').updateImage(imageID, {
            caption: caption,
            primary: 1,
            content_id: get(this, 'news.id')
          });
        }

        return promise.then(
          () => {
            news.reload();
          },
          error => {
            const serverError = get(error, 'errors.image');
            let errorMessage = 'Error: Unable to save featured image.';

            if (serverError) {
              errorMessage += ' ' + serverError;
            }

            get(this, 'toast').error(errorMessage);
          }
        );
      }
    });
  },

  validateForm() {
    this.validatePresenceOf('news.title');
    this.validateContent();
    this.validateOrganization();
    this.validateAuthor();
  },

  validateOrganization() {
    const canPublishNews = get(this, 'news.organization.canPublishNews');

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

  validateAuthor() {
    const author = get(this, 'news.authorName');
    const hasAuthorName = get(this, 'hasAuthorName');
    const overridden = get(this, 'authorOverrideEnabled');

    if ( overridden && hasAuthorName === isBlank(author) ) {
      set(this, 'errors.author', "Must choose no author or provide an author name");
    } else {
      set(this, 'errors.author', null);
      delete get(this, 'errors')['author'];
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

  _saveImage(file, primary = 0, caption = null) {
    const id = get(this, 'news.id');
    if (isBlank(id)) {
      return get(this, 'news').save().then((news) => {
        return this._saveImageWithId(get(news, 'id'), file, primary, caption);
      });
    } else {
      return this._saveImageWithId(id, file, primary, caption);
    }
  },

  _saveImageWithId(id, file, primary = 0, caption = null) {
    const data = new FormData();

    data.append('image[primary]', primary);
    data.append('image[image]', file);
    data.append('image[content_id]', id);

    if (caption) {
      data.append('image[caption]', caption);
    }

    return get(this, 'api').createImage(data);
  },

  actions: {
    notifyChange() {
      run.debounce(this, this.doAutoSave, 900);
    },

    unpublish() {
      const news = get(this, 'news');

      set(news, 'publishedAt', null);

      this._save().then(() => {
        get(this, 'toast').success('Scheduled publication canceled');
      });
    },

    publish() {
      const news = get(this, 'news');

      if (this.isValid()) {
        if (!get(this, 'news.isPublished')) {
          set(news, 'publishedAt', moment());
        }

        this._save().then(() => {
          get(this, 'toast').success('Your post has been published');
        });
      }
    },

    publishChanges() {
      if (this.isValid()) {
        this._save().then(() => {
          get(this, 'toast').success('Your changes have been saved');
        });
      }
    },

    schedulePublish() {
      if (this.isValid()) {
        set(this, 'news.publishedAt', get(this, 'selectedPubDate'));


        this._save().then(() => {
          get(this, 'toast').success('Publication is scheduled for this post');
        });
        this._clearSchedulePubDate();
      }
    },

    cancelSchedulePublish() {
      this._clearSchedulePubDate();
    },

    choosePubDate() {
      if (this.isValid()) {
        // There is a bug with the date/time picker.
        // It will round the minutes to the nearest half hour on the UI,
        // while not updating the selectedPubDate until you click on a specific time.
        // To address this issue, we're going to align the selectedPubDate
        // to the default it would display in the date/time picker

        let now = moment(),
          hours = now.get('h'),
          minutes = now.get('m');

        if (minutes > 0 && minutes < 30) {
          minutes = 30;
        } else if (minutes > 30) {
          hours += 1;
          minutes = 0;
        }

        this.setProperties({
          selectedPubDate: now.milliseconds(0).seconds(0).minutes(minutes).hours(hours),
          isPickingScheduleDate: true
        });
      }
    },

    changeOrganization(organization) {
      set(this, 'news.organization', organization);
      set(this, 'news.didOrgChange', true);

      this.send('notifyChange');
    },

    discardChanges() {
      const news = get(this, 'news');

      news.rollbackAttributes();

      // Roll back featured image selection
      setProperties(news, {
        featuredImageUrl: get(news, 'bannerImage.url'),
        featuredImageCaption: get(news, 'bannerImage.caption')
      });

      this.setProperties({
        updateContent: true,
        pendingFeaturedImage: null
      });

      get(this, 'toast').success('Changes discarded.');
    },

    saveImage(file) {
      return this._saveImage(file);
    },

    saveFeaturedImage(file, caption) {
      // Save the featured image data to be committed
      // the next time the rest of the form is saved.
      set(this, 'pendingFeaturedImage', {file, caption});

      this.send('notifyChange');
    },

    saveFeaturedImageCaption(caption) {
      // Save the featured image caption to be committed
      // the next time the rest of the form is saved.
      let pendingFeaturedImage = get(this, 'pendingFeaturedImage') || {};
      pendingFeaturedImage.caption = caption;

      set(this, 'pendingFeaturedImage', pendingFeaturedImage);

      this.send('notifyChange');
    },

    saveContent(newContent) {
      set(this, 'news.content', newContent);
      this.send('notifyChange');
    },

    togglePreview() {
      this.toggleProperty('showPreview');
    },

    toggleAuthorOverride() {
      this.toggleProperty('authorOverrideEnabled');

      if (!get(this, 'authorOverrideEnabled') ) {
        set(this, 'news.authorName', get(this, 'currentUser.name'));
      }
      this.send('notifyChange');

    },

    toggleAuthorName() {
      if (get(this,'hasAuthorName')) {
        set(this, 'news.authorName', null);
      } else {
        //default to currentUser.name in case that they uncheck box with empty input
        set(this, 'news.authorName', get(this, 'currentUser.name'));
      }
      this.send('notifyChange');
    }
  }
});
