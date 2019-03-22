import { inject as service } from '@ember/service';
import {
  notEmpty,
  alias,
  oneWay,
  readOnly,
  gt,
  or,
  equal
} from '@ember/object/computed';
import $ from 'jquery';
import Component from '@ember/component';
import { isPresent, isBlank } from '@ember/utils';
import { set, setProperties, get, computed } from '@ember/object';
import { run, next } from '@ember/runloop';
import moment from 'moment';
import Validation from 'subtext-ui/mixins/components/validation';
import TestSelector from 'subtext-ui/mixins/components/test-selector';
/* eslint-disable ember/closure-actions */

const editorConfigArray = [
  ['style', ['subtextStyleButtonMenu', 'bold', 'italic', 'underline', 'clear']],
  ['insert', ['link']],
  ['para', ['ul', 'ol']],
  ['insert', ['subtextImageModal', 'video']]
];

const editorPopoverObj = {
  image: [
    ['remove', ['subtextRemoveMedia']]
  ],
  link: [
    ['link', ['linkDialogShow', 'unlink']]
  ]
};

export default Component.extend(TestSelector, Validation, {
  classNames: ['NewsEditor'],
  "data-test-component": "NewsEditor",
  news: null,
  showPreview: false,
  store: service(),
  location: service('window-location'),

  editorHeight: 400,
  titleMaxlength: 120,
  subtitleMaxlength: 120,
  selectedPubDate: null,
  isPickingScheduleDate: false,
  api: service(),
  notify: service('notification-messages'),
  router: service(),
  isPublishing: false,
  wantsToDeleteDraft: false,
  pendingFeaturedImage: null,

  currentUser: alias('session.currentUser'),

  // flag to notify summer note to update the editor contents
  // otherwise, updates to content are ignored due to a bug in summer note
  // which causes the cursor to jump
  updateContent: false,

  init() {
    this._super(...arguments);
    setProperties(this, {
      editorConfig: editorConfigArray,
      editorPopover: editorPopoverObj
    });
  },

  organizations: oneWay('session.currentUser.managedOrganizations'),

  hasOrganization: notEmpty('news.organization'),
  organizationId: readOnly('news.organizationId'),

  hasUnpublishedChanges: computed('news{hasUnpublishedChanges,pendingFeaturedImage}', 'pendingFeaturedImage', function() {
    return get(this, 'news.hasUnpublishedChanges') || get(this, 'pendingFeaturedImage');
  }),

  canAutosave: computed('news.{isDraft,hasDirtyAttributes,didOrgChange,didLocationChange}', 'pendingFeaturedImage', function() {
    const hasDirtyAttributes = get(this, 'news.hasDirtyAttributes'),
      orgChanged = get(this, 'news.didOrgChange'),
      locationChanged = get(this, 'news.didLocationChange'),
      pendingFeaturedImage = get(this, 'pendingFeaturedImage');

    return get(this, 'news.isDraft') && (hasDirtyAttributes || orgChanged || locationChanged || pendingFeaturedImage);
  }),

  hideAutoSave: equal('news.dirtyType', 'created'),

  hidePublishedLinks: or('hasUnpublishedChanges', 'isPublishing'),

  status: computed('news.{isDraft,isScheduled,publishedAt}', function() {
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
    return (get(this, 'organizations') || []).filter((item) => {
      return get(item, 'canPublishNews');
    });
  }),

  managesMultipleOrganizations: gt('filteredOrganizations.length', 1),

  chosenOrganization: computed('filteredOrganizations', function() {
    const filteredOrganizations = get(this, 'filteredOrganizations');

    if (filteredOrganizations.length === 1) {
      set(this, 'news.organization', filteredOrganizations[0]);
      return filteredOrganizations[0];
    } else {
      return get(this, 'news.organization');
    }
  }),

  hasChosenOrganization: notEmpty('news.organization.id'),

  hasFeaturedImage: notEmpty('news.primaryImage'),

  showPreviewLink: computed('news{publishedAt,isDraft,isScheduled,isPublished,hasUnpublishedChanges,pendingFeaturedImage}', 'pendingFeaturedImage', function() {
    const news = get(this, 'news');

    return get(news, 'hasUnpublishedChanges');
  }),

  hasCaptionOrCredit: computed('news.images.@each.{caption,credit}', function() {
    return get(this, 'news.images').any(image => {
      return image.primary && ( isPresent(image.caption) ||
                                isPresent(image.credit) );
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

    const image = get(this, 'pendingFeaturedImage');
    let existingPrimaries = [];

    if (image) {
      set(this, 'pendingFeaturedImage', null);

      if (image.file) {
        existingPrimaries = get(news, 'images').filterBy('primary');

        const newImage = get(this, 'store').createRecord('image', {
          primary: true,
          caption: image.caption,
          file: image.file,
          imageUrl: image.imageUrl
        });

        get(news, 'images').addObject(newImage);
      } else {
        const primary = get(news, 'primaryImage');
        primary.set('caption', image.caption);
      }
    }

    return news.save()
    .then(() => {
      set(this, 'news.didOrgChange', false);
      set(this, 'news.didLocationChange', false);
      existingPrimaries.forEach(i => i.destroyRecord());
    })
    .catch((error) => {

      if (error.type && error.type === 'image' && error.image) {
        get(this, 'notify').error('There was an error saving the image. Please try again.');

        const images = get(this, 'news.images');
        const imageWithError = images.findBy('position', error.image.position);

        if (imageWithError.primary) {
          set(this, 'news.primaryImageUrl', null);
        }

        imageWithError.rollbackAttributes();
      }
    });
  },

  validateForm() {
    return  this.validatePresenceOf('news.title') &&
            this.validatePrimaryImage() &&
            this.validateContent() &&
            this.validateOrganization();
  },

  validateOrganization() {
    const canPublishNews = get(this, 'news.organization.canPublishNews');

    if (canPublishNews) {
      set(this, 'errors.organization', null);
      delete get(this, 'errors')['organization'];
      return true;
    } else {
      set(this, 'errors.organization', 'A valid Organization is required');
      return false;
    }
  },

  validateContent() {
    let content = get(this, 'news.content');

    let $content = $('<div />').append($.parseHTML(content));
    content = $content.prop('outerHTML');

    const hasImages = $content.find('img').length > 0;

    if (!hasImages && (isBlank(content) || content.replace(/<[^>]*>/g, '').trim() === '')) {
      set(this, 'errors.content', "News can't be blank.");
      return false;
    } else {
      set(this, 'errors.content', null);
      delete get(this, 'errors')['content'];
      return true;
    }
  },

  validatePrimaryImage() {
    const primaryImageUrl = get(this, 'news.primaryImageUrl');

    if ( isBlank(primaryImageUrl) ) {
      set(this, 'errors.image', "A Featured Image is required.");
      return false;
    } else {
      set(this, 'errors.image', null);
      delete get(this, 'errors')['image'];
      return true;
    }
  },

  isValid() {
    const isValid = this._super(...arguments);

    if (!isValid) {
      get(this, 'notify').error('Please fill out all required fields');
    }

    return isValid;
  },

  doAutoSave() {
    if (get(this, 'canAutosave')) {
      if (this.validateForm()) {
        this._save();
      }
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
        get(this, 'notify').success('Scheduled publication canceled');
      });
    },

    publish() {
      const news = get(this, 'news');

      if (this.isValid()) {
        if (!get(this, 'news.isPublished')) {
          set(news, 'publishedAt', moment());
        }

        // Avoid showing link to detail page until the entire publish has finished (including image upload, FB notify, etc)
        set(this, 'isPublishing', true);

        this._save().then(() => {
          get(this, 'notify').success('Your post has been published');
          set(this, 'isPublishing', false);
          this.sendAction('afterPublish');
        });
      }
    },

    publishChanges() {
      if (this.isValid()) {
        this._save().then(() => {
          get(this, 'notify').success('Your changes have been saved');
          this.sendAction('afterPublish');
        });
      }
    },

    schedulePublish() {
      if (this.isValid()) {
        set(this, 'news.publishedAt', get(this, 'selectedPubDate'));

        this._save().then(() => {
          get(this, 'notify').success('Publication is scheduled for this post');
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
      next(() => {
        set(this, 'news.organization', organization);
        set(this, 'news.didOrgChange', true);

        this.send('notifyChange');
      });
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

      get(this, 'notify').success('Changes discarded.');
    },

    saveImage(file) {
      return this._saveImage(file);
    },

    saveFeaturedImage(file, caption, imageUrl) {
      // Save the featured image data to be committed
      // the next time the rest of the form is saved.
      set(this, 'pendingFeaturedImage', {file, caption, imageUrl});

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
      if (this.isValid()) {
        this.toggleProperty('showPreview');
      }
    },

    toggleDeleteDraft() {
      this.toggleProperty('wantsToDeleteDraft');
    },

    deleteDraft() {
      set(this, 'isDeletingRecord', true);

      get(this, 'news').destroyRecord()
      .then((record) => {
        const organizationId = get(record, 'organizationId') || null;

        let nextRoute = 'news.new.details';
        let transitionData = null;

        if (isPresent(organizationId)) {
          nextRoute = 'profile.all.index';
          transitionData = organizationId;
        }

        get(this, 'router').transitionTo(nextRoute, transitionData, {
          queryParams: {
            resetController: true
          }
        });
      })
      .catch(() => {
        get(this, 'notify').error('There was an error deleting the draft. Please refresh and try again.');
      })
      .finally(() => {
        set(this, 'isDeletingRecord', false);
      });
    },

    locationChanged() {
      set(this, 'news.didLocationChange', true);
      this.send('notifyChange');
    },

    startNewPost() {
      get(this, 'router').transitionTo('news.new')
      .then(() => {
        this.sendAction('refreshModel');
      });
    },

    goToProfilePage() {
      const chosenOrganizationId = get(this, 'chosenOrganization.id');
      get(this, 'router').transitionTo('profile.all', chosenOrganizationId);
    }
  }
});
