import { alias, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, getProperties, get } from '@ember/object';
import { isPresent, isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import Validation from 'subtext-app/mixins/components/validation';

export default Component.extend(Validation, {

  organization: null,
  model: null,
  onFormUpdate() {},

  profileImage: alias('model.profileImage'),
  backgroundImage: alias('model.backgroundImage'),
  desktopImage: alias('model.desktopImage'),

  profileImageFormVisible: false,
  backgroundImageFormVisible: false,
  desktopImageFormVisible: false,


  displayProfileImageForm: computed('model.profileImageUrl', 'profileImageFormVisible', function() {
    return get(this, 'profileImageFormVisible') || isBlank(get(this, 'model.profileImageUrl'));
  }),

  displayBackgroundImageForm: computed('model.backgroundImageUrl', 'backgroundImageFormVisible', function() {
    return get(this, 'backgroundImageFormVisible') || isBlank(get(this, 'model.backgroundImageUrl'));
  }),

  displayDesktopImageForm: computed('model.desktopImageUrl', 'desktopImageFormVisible', function() {
    return get(this, 'desktopImageFormVisible') || isBlank(get(this, 'model.pdesktopImageUrl'));
  }),

  hasNewProfileImage: notEmpty('model.profileImage'),

  didReceiveAttrs() {
    this._super(...arguments);

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'model', getProperties(organization, [
        'profileImage',
        'profileImageUrl',
        'backgroundImage',
        'backgroundImageUrl',
        'desktopImage',
        'desktopImageUrl'
      ]));
    }
  },

  validateForm() {
    this.validateImage('profileImage');
    this.validateImage('backgroundImage');
    this.validateImage('desktopImage');
  },

  formUpdated() {
    this.onFormUpdate(this.isValid(), get(this, 'model'));
  },

  actions: {
    formUpdated() {
      run.debounce(this, this.formUpdated, 100);
    },
    showProfileImageForm() {
      set(this, 'profileImageFormVisible', true);
    },
    showBackgroundImageForm() {
      set(this, 'backgroundImageFormVisible', true);
    },
    showDesktopImageForm() {
      set(this, 'desktopImageFormVisible', true);
    },
    updateProfileImage(imageData) {
      set(this, 'model.profileImage', imageData);
      this.send('formUpdated');
    },
    updateBackgroundImage(imageData) {
      set(this, 'model.backgroundImage', imageData);
      this.send('formUpdated');
    },
    updateDesktopImage(imageData) {
      this.setProperties({
        'model.desktopImage': imageData,
        'model.removeDesktopImage': false
      });
      this.send('formUpdated');
    },
    deleteDesktopImage() {
      this.setProperties({
        'model.desktopImage': null,
        'model.removeDesktopImage': true
      });
      this.send('formUpdated');
    }
  }
});
