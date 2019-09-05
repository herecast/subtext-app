import { get, set, setProperties, computed } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import { inject as service } from '@ember/service';
import { equal, notEmpty, readOnly, not } from '@ember/object/computed';
import { later, next, debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import $ from 'jquery';
import Validation from 'subtext-app/mixins/components/validation';
import Component from '@ember/component';

export default Component.extend(Validation, {
  classNames: ['JobsForms'],
  activeForm: 'market',

  floatingActionButton: service(),
  modals: service(),
  media: service(),
  session: service(),
  store: service(),
  router: service(),

  model: null,
  editingModel: null,
  isEditingModel: notEmpty('editingModel'),

  isEditing: true,
  isPreviewing: not('isEditing'),
  isSaving: false,
  hasTriedToSubmitForm: false,
  onClose: function() {},

  marketIsActive: equal('activeForm', 'market'),
  calendarIsActive: equal('activeForm', 'event'),

  formComponentName: computed('activeForm', function() {
    const activeForm = get(this, 'activeForm');
    return `jobs-forms/${activeForm}-form`;
  }),

  marketClass: computed('activeForm', 'isEditing', function() {
    if (get(this, 'activeForm') === 'market') {
      return htmlSafe('active');
    }

    if (!get(this, 'isEditing')) {
      return htmlSafe('disabled');
    } else {
      return '';
    }
  }),

  eventClass: computed('activeForm', 'isEditing', function() {
    if (get(this, 'activeForm') === 'event') {
      return htmlSafe('active');
    }

    if (!get(this, 'isEditing')) {
      return htmlSafe('disabled');
    } else {
      return '';
    }
  }),

  canPublishNews: readOnly('session.currentUser.canPublishNews'),

  init() {
    const editingModel = get(this, 'editingModel');

    if (isPresent(editingModel)) {
      set(this, 'model', editingModel);
    } else if (isBlank(get(this, 'model'))) {
      this._startNewBuild();
    }

    set(this, 'hasCheckedModalBodyClass', false);

    this._watchFocus();

    this._super(...arguments);
  },

  willDestroyElement() {
    get(this, 'model').rollbackAttributes();

    this._unwatchFocus();

    this._super(...arguments);
  },

  _startNewBuild() {
    const activeForm = get(this, 'activeForm');
    let newRecordValues = {
      contentType: activeForm,
      authorName: null,
      avatarUrl: null
    };

    const currentUser = get(this, 'session.currentUser');

    if (isPresent(currentUser) && isPresent(get(currentUser, 'name'))) {
      newRecordValues.authorName = get(currentUser, 'name');
      newRecordValues.avatarUrl = get(currentUser, 'userImageUrl');

      const hasManagedOrganizations = isPresent(get(currentUser, 'managedOrganizations'));

      if (hasManagedOrganizations) {
        const defaultOrganization = get(currentUser, 'managedOrganizations.firstObject');
        newRecordValues.organization = defaultOrganization;
      }
    } else {
      //There is an auth delay when logging in and transition to form
      later(() => {
        this._updateModelBaseAttributes();
      }, 300);
    }

    const model = get(this, 'store').createRecord('content', newRecordValues);
    set(this, 'model', model);
  },

  _updateModelBaseAttributes() {
    const model = get(this, 'model');
    const currentUser = get(this, 'session.currentUser');

    setProperties(model, {
      authorName: get(currentUser, 'name'),
      avatarUrl: get(currentUser, 'userImageUrl')
    });
  },

  _watchFocus() {
    if (get(this, 'media.isMobile')) {
      $('body').on('focus.jobsForms', 'input,textarea', (e) => {
        if (!get(this, 'isDestroying')) {
          const form =  $(e.target).parents('form')[0];
          if (isPresent(form) && isPresent(e.target)) {
            const relativeScrollTop = $(e.target).offset().top - $(form).offset().top;

            $(window).on('resize.jobsForms', () => {
              debounce(this, '_scrollToTop', relativeScrollTop, 50);
            });
          }
        }
      });
    }
  },

  _unwatchFocus() {
    $('body').off('focus.jobsForms');
  },

  _scrollToTop(relativeScrollTop=0) {
    next(() => {
      $(get(this, 'element')).parent().animate({
        scrollTop: relativeScrollTop
      }, 300);

      $(window).off('resize.jobsForms');
    });
  },

  _scrollToFirstError() {
    next(() => {
      const $firstError = $(get(this, 'element')).find('.has-formerror').first();
      const $firstErrorTop = $firstError.position().top;
      const scrollTop = $firstErrorTop > 0 ? $firstErrorTop : 0;

      $(get(this, 'element')).parent().animate({ scrollTop }, 300);
    });
  },

  _validateMetadata() {
    const email = get(this, 'model.contactEmail');
    const phone = get(this, 'model.contactPhone');
    const url = get(this, 'model.url');

    const hasEitherRequiredField = isPresent(email) || isPresent(phone);
    const hasUrl = isPresent(url);

    if (hasEitherRequiredField) {
      const hasValidEmail = isBlank(email) || this.hasValidEmail(email);
      const hasValidPhone = this.hasValidPhone(phone);

      if (hasValidEmail && hasValidPhone) {
        if (hasUrl && !this.hasValidUrl('url')) {
          set(this, 'errors.metadata', 'Invalid link URL');
        } else {
          set(this, 'errors.metadata', null);
          delete get(this, 'errors').metadata;
        }
      } else if (!hasValidEmail && hasValidPhone) {
        set(this, 'errors.metadata', 'Invalid email address');
      } else if (hasValidEmail && !hasValidPhone) {
        set(this, 'errors.metadata', 'Invalid phone number');
      } else if (!hasValidEmail && !hasValidPhone) {
        set(this, 'errors.metadata', 'Invalid email address and phone number');
      }
    } else {
      set(this, 'errors.metadata', 'Must include phone or email contact info');
    }

    if (url) {
      this.hasValidUrl('url');
    }
  },

  _validateVenue() {
    const id = get(this, 'model.venueId');
    const address = get(this, 'model.venueAddress');
    const city = get(this, 'model.venueCity');
    const state = get(this, 'model.venueState');
    const zip = get(this, 'model.venueZip');

    const hasAllFields = isPresent(address) && isPresent(city) &&
      isPresent(state) && isPresent(zip);

    if (isPresent(id) || hasAllFields) {
      this.set('errors.venue', null);
      delete get(this,'errors').venue;
    } else {
      this.set('errors.venue', 'Cannot be blank');
    }
  },

  _validateEventInstances() {
    const eventInstances = get(this, 'model.eventInstances');

    if (isPresent(eventInstances)) {
      set(this, `errors.dates`, null);
      delete this.get('errors')['dates'];
    } else {
      set(this, `errors.dates`, 'Must have at least one valid date');
    }
  },

  _validateImages() {
    const primaryImage = get(this, 'model.primaryImage');

    if (isPresent(primaryImage)) {
      set(this, `errors.images`, null);
      delete this.get('errors')['images'];
    } else {
      set(this, `errors.images`, 'Must have at least one valid image');
    }
  },

  validateForm() {
    this.validatePresenceOf('model.title');
    this.validatePresenceOf('model.content');
    this._validateImages();
    this._validateMetadata();

    if (get(this, 'activeForm') === 'event') {
      this._validateVenue();
      this._validateEventInstances();
    }
  },

  _afterLaunch(model) {
    const router = get(this, 'router');
    const goToProfilePage = isPresent(get(model, 'organization.id')) && parseInt(get(model, 'organization.id')) !== 398;
    const isInMystuff = get(router, 'currentRouteName').includes('mystuff');

    next(() => {
      const contentId = get(model, 'id');
      const eventInstanceId = get(model, 'eventInstanceId') || false;
      const organizationId = get(model, 'organization.id') || false;

      let transitionOptions = [];

      if (isInMystuff) {
        if (eventInstanceId) {
          transitionOptions = ['mystuff.contents.show-instance', contentId, eventInstanceId];
        } else {
          transitionOptions = ['mystuff.contents.show', contentId];
        }
      } else if (goToProfilePage) {
        if (eventInstanceId) {
          transitionOptions = ['profile.all.show-instance', organizationId, contentId, eventInstanceId];
        } else {
          transitionOptions = ['profile.all.show', organizationId, contentId];
        }
      } else {
        if (eventInstanceId) {
          transitionOptions = ['feed.show-instance', contentId, eventInstanceId, {queryParams:{type: 'calendar'}}];
        } else {
          transitionOptions = ['feed.show', contentId, {queryParams:{type: 'market'}}];
        }
      }

      router.transitionTo(...transitionOptions);
    });
  },

  _checkBodyClass() {
    set(this, 'hasCheckedModalBodyClass', true);

    if (!get(this, 'modals').hasModalBodyClass()) {
      get(this, 'modals').addModalBodyClass();
    }
  },

  touchStart() {
    if (!get(this, 'hasCheckedModalBodyClass')) {
      this._checkBodyClass();
    }
  },

  mouseMove() {
    if (!get(this, 'hasCheckedModalBodyClass')) {
      this._checkBodyClass();
    }
  },

  actions: {
    toggleForm(formName) {
      if (get(this, 'activeForm') !== formName && get(this, 'isEditing')) {
        set(this, 'activeForm', formName);
        set(this, 'model.contentType', formName);
      }
    },

    onChange() {
      if (get(this, 'hasTriedToSubmitForm')) {
        later(() => {
          this.validateForm();
        })
      }
    },

    goToPreview() {
      set(this, 'hasTriedToSubmitForm', true);

      if (this.isValid()) {
        set(this, 'isEditing', false);
        this._scrollToTop();
      } else {
        this._scrollToFirstError();
      }
    },

    goToEdit() {
      set(this, 'isEditing', true);
      this._scrollToTop();
    },

    goToNewsEditor() {
      if (get(this, 'isEditing')) {
        const confirmedMessage = get(this, 'isEditingModel') ? 'This will discard any changes to this post?' : 'Are you sure you want to discard this post?';
        const confirmed = confirm(confirmedMessage);

        if (confirmed) {
          let transition= get(this, 'router').transitionTo('news.new');

          transition._keepDefaultQueryParamValues = false;

          transition.retry();
        }
      }
    },

    saveEditedContent() {
      set(this, 'hasTriedToSubmitForm', true);

      if (this.isValid()) {
        this.send('launchContent');
      } else {
        this._scrollToFirstError();
      }
    },

    launchContent() {
      set(this, 'isSaving', true);

      const justCreated = get(this, 'model.isNew');

      get(this, 'model').save()
      .then((model) => {
        get(this, 'floatingActionButton').launchContent(model, {
          justCreated: justCreated,
          justEdited: !justCreated
        });

        this._afterLaunch(model);
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.info(`[Error Launching Content]`);
      })
      .finally(() => {
        get(this, 'onClose')();

        if (!get(this, 'isDestroyed')) {
          set(this, 'isSaving', false);
        }
      });
    },

    closeForm() {
      let confirmedMessage = 'Are you sure you want to leave?';

      if (get(this, 'model.isNew')) {
        confirmedMessage = 'Are you sure you want to discard this post?';
      } else if (get(this, 'model.hasDirtyAttributes')) {
        confirmedMessage = 'Are you sure you want to leave? Changes to this post will not be saved.';
      }

      const confirmed = confirm(confirmedMessage);

      if (confirmed) {
        get(this, 'model').rollbackAttributes();
        set(this, 'model.hasDirtyAttributes', false);

        if (get(this, 'model.contentType') === 'event') {
          get(this, 'model').rollbackSchedules();
        }

        get(this, 'onClose')();
      } else {
        return false;
      }
    }
  }
});
