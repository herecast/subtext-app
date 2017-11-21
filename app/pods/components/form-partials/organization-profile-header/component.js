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

  displayBackgroundImageForm: computed('model.backgroundImageUrl', 'backgroundImageFormVisible', function() {
    return get(this, 'backgroundImageFormVisible') || isBlank(get(this, 'model.backgroundImageUrl'));
  }),

  displayProfileImageForm: computed('model.profileImageUrl', 'profileImageFormVisible', function() {
    return get(this, 'profileImageFormVisible') || isBlank(get(this, 'model.profileImageUrl'));
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
        'profileImage',
        'profileImageUrl',
        'backgroundImage',
        'backgroundImageUrl'
      ]));
    }
  },

  validateForm() {
    this.hasValidUrl('subscribeUrl');
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
    }
  }
});
