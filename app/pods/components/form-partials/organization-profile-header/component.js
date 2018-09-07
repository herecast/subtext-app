import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {get, getProperties, set, computed, isBlank, isPresent, run} = Ember;

export default Ember.Component.extend(Validation, {

  organization: null,
  model: null,
  onFormUpdate() {},

  profileImage: computed.alias('model.profileImage'),
  backgroundImage: computed.alias('model.backgroundImage'),
  desktopImage: computed.alias('model.desktopImage'),

  isBlog: computed.readOnly('organization.isBlog'),

  profileImageFormVisible: false,
  backgroundImageFormVisible: false,
  desktopImageFormVisible: false,

  showSubscribeOption: false,
  showSpecialLinkOption: false,

  displayProfileImageForm: computed('model.profileImageUrl', 'profileImageFormVisible', function() {
    return get(this, 'profileImageFormVisible') || isBlank(get(this, 'model.profileImageUrl'));
  }),

  displayBackgroundImageForm: computed('model.backgroundImageUrl', 'backgroundImageFormVisible', function() {
    return get(this, 'backgroundImageFormVisible') || isBlank(get(this, 'model.backgroundImageUrl'));
  }),

  displayDesktopImageForm: computed('model.desktopImageUrl', 'desktopImageFormVisible', function() {
    return get(this, 'desktopImageFormVisible') || isBlank(get(this, 'model.pdesktopImageUrl'));
  }),

  subscribeOptionIsActive: computed('model.subscribeUrl', 'showSubscribeOption', function() {
    return isPresent(get(this,'model.subscribeUrl')) || get(this, 'showSubscribeOption');
  }),

  specialLinkOptionIsActive: computed('model.specialLinkUrl', 'showSpecialLinkOption', function() {
    return isPresent(get(this,'model.specialLinkUrl')) || get(this, 'showSpecialLinkOption');
  }),

  hasNewProfileImage: computed.notEmpty('model.profileImage'),

  didReceiveAttrs() {
    this._super(...arguments);

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'model', getProperties(organization, [
        'subscribeUrl',
        'specialLinkUrl',
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
    this.hasValidUrl('subscribeUrl');
    this.hasValidUrl('specialLinkUrl');
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
    },
    chooseSpecialLinkOption(option) {
      if (option === 'subscribe') {
        this.setProperties({
          'showSubscribeOption': true,
          'showSpecialLinkOption': false,
          'model.specialLinkUrl': null,
          'model.specialLinkText': null
        });
      } else if (option === 'donate') {
        this.setProperties({
          'showSubscribeOption': false,
          'showSpecialLinkOption': true,
          'model.subscribeUrl': null,
          'model.specialLinkText': 'Donate'
        });
      }
      this.send('formUpdated');
    }
  }
});
