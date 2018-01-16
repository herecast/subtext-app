import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {get, getProperties, set, computed, isBlank, isPresent, run} = Ember;

export default Ember.Component.extend(Validation, {

  organization: null,
  model: null,
  onFormUpdate() {},

  profileImage: computed.alias('model.profileImage'),
  backgroundImage: computed.alias('model.backgroundImage'),

  backgroundImageFormVisible: false,
  profileImageFormVisible: false,

  showSubscribeOption: false,
  showSpecialLinkOption: false,

  displayBackgroundImageForm: computed('model.backgroundImageUrl', 'backgroundImageFormVisible', function() {
    return get(this, 'backgroundImageFormVisible') || isBlank(get(this, 'model.backgroundImageUrl'));
  }),

  displayProfileImageForm: computed('model.profileImageUrl', 'profileImageFormVisible', function() {
    return get(this, 'profileImageFormVisible') || isBlank(get(this, 'model.profileImageUrl'));
  }),

  subscribeOptionIsActive: computed('model.subscribeUrl', 'showSubscribeOption', function() {
    return isPresent(get(this,'model.subscribeUrl')) || get(this, 'showSubscribeOption');
  }),

  specialLinkOptionIsActive: computed('model.specialLinkUrl', 'showSpecialLinkOption', function() {
    return isPresent(get(this,'model.specialLinkUrl')) || get(this, 'showSpecialLinkOption');
  }),

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
        'backgroundImageUrl'
      ]));
    }
  },

  validateForm() {
    this.hasValidUrl('subscribeUrl');
    this.hasValidUrl('specialLinkUrl');
    this.validateImage('profileImage');
    this.validateImage('backgroundImage');
  },

  formUpdated() {
    this.onFormUpdate(this.isValid(), get(this, 'model'));
  },

  actions: {
    formUpdated() {
      run.debounce(this, this.formUpdated, 100);
    },
    showBackgroundImageForm() {
      set(this, 'backgroundImageFormVisible', true);
    },
    showProfileImageForm() {
      set(this, 'profileImageFormVisible', true);
    },
    updateProfileImage(imageData) {
      set(this, 'model.profileImage', imageData);
      this.send('formUpdated');
    },
    updateBackgroundImage(imageData) {
      set(this, 'model.backgroundImage', imageData);
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
