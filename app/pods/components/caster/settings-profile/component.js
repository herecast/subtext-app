import { get, set, setProperties, computed } from '@ember/object';
import { readOnly, alias, or } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import Validation from 'subtext-app/mixins/components/validation';
import Component from '@ember/component';

export default Component.extend(Validation, {
  classNames: ['Caster-SettingsAccount'],

  notifications: service('notification-messages'),

  caster: null,

  casterName: alias('caster.name'),
  casterDescription: alias('caster.description'),
  casterPhone: alias('caster.phone'),
  casterWebsite: alias('caster.website'),

  hasMadeChanges: readOnly('caster.hasDirtyAttributes'),
  hasPendingChanges: readOnly('caster.hasPendingChanges'),

  init() {
    this._super(...arguments);
    this._resetProperties();
  },

  _resetProperties() {
    setProperties(this, {
      isEditingDisplayName: false,
      isEditingDescription: false,
      isEditingPhone: false,
      isEditingWebsite: false,
      wantsToEditAvatarImage: false,
      wantsToEditBackgroundImage: false,
      isSavingChanges: false
    });

    if (get(this, 'caster')) {
      get(this, 'caster').rollbackAttributes();
    }
  },

  _addFocus(inputId) {
    next(() => {
      $(this.element).find(`#${inputId}`).focus();
    });
  },

  _filterPhone() {
    let casterPhone = get(this, 'casterPhone');

    if (casterPhone) {
      set(this, 'casterPhone', casterPhone.replace(/[^0-9]/g, ""));
    }
  },

  phoneIsValidOrBlank: computed('casterPhone', function() {
    if (isPresent(get(this, 'casterPhone'))) {
      return this.hasValidPhone(get(this, 'casterPhone')) && get(this, 'casterPhone.length') === 10;
    }

    return true;
  }),

  websiteIsValidOrBlank: computed('casterWebsite', function() {
    if (isPresent(get(this, 'casterWebsite'))) {
      return this.urlIsValid(get(this, 'casterWebsite'));
    }

    return true;
  }),

  changesNotValid: computed('phoneIsValidOrBlank', 'websiteIsValidOrBlank', function() {
    return !(get(this, 'phoneIsValidOrBlank') && get(this, 'websiteIsValidOrBlank'))
  }),

  modalIsOpen: or('wantsToEditAvatarImage', 'wantsToEditBackgroundImage'),

  willDestroyElement() {
    if (get(this, 'caster.hasDirtyAttributes')) {
      this._resetProperties();
    }

    this._super(...arguments);
  },

  actions: {
    editDisplayName() {
      set(this, 'isEditingDisplayName', true);
      this._addFocus('caster-name');
    },

    editDescription() {
      set(this, 'isEditingDescription', true);
      this._addFocus('caster-description');
    },

    editPhone() {
      set(this, 'isEditingPhone', true);
      this._addFocus('caster-phone');
    },

    editWebsite() {
      set(this, 'isEditingWebsite', true);
      this._addFocus('caster-website');
    },

    phoneChanged() {
      this._filterPhone();
    },

    cancelEditing() {
      this._resetProperties();
    },

    saveChanges() {
      set(this, 'isSavingChanges', true);

      const isChangingImage = isPresent(get(this, 'caster.avatarImage')) || isPresent(get(this, 'caster.backgroundImage'));

      get(this, 'caster').save()
      .then(() => {
        this._resetProperties();
        get(this, 'notifications').success('Successfully saved changes.');
        if (isChangingImage) {
          $(window).scrollTop(0);
        }
      })
      .catch(() => {
        get(this, 'notifications').error('Error: Unable to save changes.');
      })
      .finally(() => {
        set(this, 'isSavingChanges', false);
      });
    },

    editAvatarImage() {
      this.toggleProperty('wantsToEditAvatarImage');
    },

    editBackgroundImage() {
      this.toggleProperty('wantsToEditBackgroundImage');
    }
  }
});
