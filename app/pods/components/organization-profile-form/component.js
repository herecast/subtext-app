import Ember from 'ember';
import Validation from '../../../mixins/components/validation';

const { get, set, isPresent, isBlank, computed, RSVP, inject } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',

  _originalImageUrl: computed.oneWay('model.logoUrl'),

  notify: inject.service('notification-messages'),

  submit(e) {
    e.preventDefault();
    this.save();
  },

  validateForm() {
    this.validatePresenceOf('model.name');
    this.validateImage('logo');
    this.validateImage('profileImage');
    this.validateImage('backgroundImage');
    this.hasValidUrl('subscribeUrl');
    this.hasValidTwitterHandle();
  },

  notifySaved() {
    get(this, 'notify').success('Successfully saved changes.');

    const didSave = get(this, 'didSave');
    if (didSave) {
      didSave(get(this, 'model'));
    }
  },

  logoImageFormVisible: false,
  backgroundImageFormVisible: false,
  profileImageFormVisible: false,

  displayLogoImageForm: computed('model.logoUrl', 'logoImageFormVisible', function() {
    return get(this, 'logoImageFormVisible') || isBlank(get(this, 'model.logoUrl'));
  }),

  displayBackgroundImageForm: computed('model.backgroundImageUrl', 'backgroundImageFormVisible', function() {
    return get(this, 'backgroundImageFormVisible') || isBlank(get(this, 'model.backgroundImageUrl'));
  }),

  displayProfileImageForm: computed('model.profileImageUrl', 'profileImageFormVisible', function() {
    return get(this, 'profileImageFormVisible') || isBlank(get(this, 'model.profileImageUrl'));
  }),

  save() {
    if(this.isValid()) {
      const model = get(this, 'model');
      const notify = get(this, 'notify');

      model.save().then(()=>{
        const rsvpHash = {};


        if(isPresent(model.get('logo'))) {
          rsvpHash.logo = model.uploadLogo();
          rsvpHash.logo.catch(function() {
            notify.error('Unable to upload logo. Please check that it meets the minimum dimensions.');
          });
        }

        if(isPresent(model.get('profileImage'))) {
          rsvpHash.profileImage = model.uploadProfileImage();
          rsvpHash.profileImage.catch(function() {
            notify.error('Unable to upload profile image. Please check that it meets the minimum dimensions.');
          });
        }

        if(isPresent(model.get('backgroundImage'))) {
          rsvpHash.backgroundImage = model.uploadBackgroundImage();
          rsvpHash.backgroundImage.catch(function() {
            notify.error('Unable to upload background image. Please check that it meets the minimum dimensions.');
          });
        }

        if (isPresent(rsvpHash)) {
          RSVP.hash(rsvpHash).then(()=>{
            // Reload to update the image urls
            model.reload().then(() => {
              this.notifySaved();
            });
          });
        } else {
          this.notifySaved();
        }
      }, (/*errors*/) => {
        notify.error('Error: Unable to save changes.');
      });
    }
  },

  actions: {
    save() {
      this.save();
    },
    updateContent(content) {
      set(this, 'model.description', content);
    },
    showLogoImageForm() {
      set(this, 'logoImageFormVisible', true);
    },
    showBackgroundImageForm() {
      set(this, 'backgroundImageFormVisible', true);
    },
    showProfileImageForm() {
      set(this, 'profileImageFormVisible', true);
    }
  }
});
