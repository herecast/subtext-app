import Ember from 'ember';
import emailIsValid from 'subtext-ui/utils/email-is-valid';
/* global loadImage */

const { set, get, computed, inject:{service}, run, RSVP:{Promise} } = Ember;

export default Ember.Controller.extend({
  startIntro: true,

  session: service(),
  notify: service('notification-messages'),
  api: service(),

  currentUser: computed.alias('session.currentUser'),
  hasCurrentUser: computed.notEmpty('currentUser'),
  hasNoCurrentUser: computed.not('hasCurrentUser'),
  currentUserIsBlogger: computed.readOnly('currentUser.isBlogger'),

  avatarUrls: {
    delighted: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_delighted.png',
    smiling: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_smiling.png',
    thinking: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_thinking.png',
    thumbsup: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_thumbsup.png',
    profile: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_profile.png',
    background: 'https://s3.amazonaws.com/subtext-misc/startablog/JenniferBot_background.png'
  },

  genericProfileImageUrl: 'https://s3.amazonaws.com/subtext-misc/startablog/generic-profile-picture.jpg',

  organization: computed.alias('model'),

  backgroundImageInputClass: 'BloggerIntro-Step-background-image-input',
  profileImageInputClass: 'BloggerIntro-Step-profile-image-input',

  hasStartedWritingName: false,
  hasOrganizationName: computed.gt('organization.name.length', 4),
  organizationNameIsUnique: false,
  organizationNameIsGood: computed.and('hasOrganizationName', 'organizationNameIsUnique'),
  isCheckingOrganizationName: false,

  hasNewOrganizationProfileImage: false,

  hasNewOrganizationBackgroundImage: false,

  isCreatingOrganization: false,

  hasValidEmail: false,
  connectEmailButtonText: computed('organization.email', function() {
    return `Use ${get(this, 'currentUser.email')}`;
  }),

  hasValidWebsite: computed('organization.website', function() {
    const website = get(this, 'organization.website') || '';
    const regexp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig;

    return website.match(regexp);
  }),

  minDescriptionLength: 100,
  hasValidDescription: computed('organization.description.length', 'minDescriptionLength', function() {
    return get(this, 'organization.description.length') > get(this, 'minDescriptionLength');
  }),
  descriptionLengthText: computed('organization.description', function() {
    const minDescriptionLength = get(this, 'minDescriptionLength');
    const descriptionLength = get(this, 'organization.description.length') || 0;

    if (descriptionLength > minDescriptionLength) {
      return 'Looks good.';
    } else {
      return `${descriptionLength}/${minDescriptionLength} Required`;
    }
  }),

  _loadImageFile(file, setToSquare) {
    const options = {
      orientation: true,
      canvas: true,

      // This reduces the image file size
      maxWidth: 2000,
      maxHeight: 2000
    };
    return new Promise((resolve, reject) => {
      loadImage(file, (canvas) => {
        run(()=>{
          if (this._validateCanvasDimensions(canvas)) {
            let canvasToConvert = canvas;

            if (setToSquare) {
              canvasToConvert = this._cropImageToSquare(canvas);
            }

            const imageType = get(file, 'type') || 'image/jpeg';
            const url = canvasToConvert.toDataURL(imageType);

            resolve(url);
          } else {
            reject();
          }
        });
      }, options);
    });

  },

  _cropImageToSquare(canvas) {
    const sourceWidth = canvas.width;
    const sourceHeight = canvas.height;

    if (sourceHeight !== sourceWidth) {
      get(this, 'notify').warning('Image will be cropped to square. You can upload a different image that is square for better results.');

      const minSide = Math.min(sourceHeight, sourceWidth);
      const sourceX = (sourceWidth / 2) - (minSide / 2);
      const sourceY = (sourceHeight / 2) - (minSide / 2);

      let croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = minSide;
      croppedCanvas.height = minSide;
      croppedCanvas.getContext("2d").drawImage(canvas, sourceX, sourceY, minSide, minSide, 0, 0, minSide, minSide);

      return croppedCanvas;
    }

    return canvas;
  },

  _validateCanvasDimensions(canvas) {
    const minHeight = 200;
    const minWidth = 200;
    const maxHeight = 2000;
    const maxWidth = 2000;

    if (canvas.width < minWidth || canvas.height < minHeight) {
      get(this, 'notify').error(`Image must be at least ${minWidth}px wide by ${minHeight}px tall`);
      return false;
    }

    if (canvas.width > maxWidth || canvas.height > maxHeight) {
      get(this, 'notify').error(`Image must be less than ${maxWidth}px wide by ${maxHeight}px tall`);
      return false;
    }

    return true;
  },

  _addOrganizationToManagedList(organization) {
    const currentUser = get(this, 'currentUser');
    let managedOrganizations = get(currentUser, 'managedOrganizations');
    managedOrganizations.pushObject(organization);
  },

  _checkOrganizationName() {
    if (get(this, 'hasOrganizationName')) {
      const organziationName = get(this, 'organization.name');

      set(this, 'isCheckingOrganizationName', true);

      get(this, 'api').isExistingOrganizationName(organziationName)
      .then(() => {
        set(this, 'organizationNameIsUnique', true);
      })
      .catch(() => {
        set(this, 'organizationNameIsUnique', false);
        get(this, 'notify').error(`${organziationName} is already taken. Please try another name.`);
      })
      .finally(() => {
        set(this, 'isCheckingOrganizationName', false);
      });
    }
  },

  _checkOrganizationEmail() {
    const email = get(this, 'organization.email');
    set(this, 'hasValidEmail', emailIsValid(email));
  },

  actions: {
    uploadProfileImage() {
      const fileInput = Ember.$(document).find(`.${get(this, 'profileImageInputClass')}`)[0];
      fileInput.click();
    },

    setProfileImageToStock() {
      const organization = get(this, 'organization');

      organization.setProperties({
        profileImageUrl: get(this, 'genericProfileImageUrl'),
        profileImage: null
      });
    },

    profileImageSelected(files) {
      const imageFile = files[0];
      const organization = get(this, 'organization');

      this._loadImageFile(imageFile, true)
      .then((dataUrl) => {
        organization.setProperties({
          profileImageUrl: dataUrl,
          profileImage: imageFile
        });

        set(this, 'hasNewOrganizationProfileImage', true);
      })
      .catch(() => {
        this.send('setProfileImageToStock');

        set(this, 'hasNewOrganizationProfileImage', false);
      });
    },

    uploadBackgroundImage() {
      const fileInput = Ember.$(document).find(`.${get(this, 'backgroundImageInputClass')}`)[0];
      fileInput.click();
    },

    setBackgroundImageToStock() {
      const organization = get(this, 'organization');

      organization.setProperties({
        backgroundImageUrl: '',
        profileImage: null
      });
    },

    backgroundImageSelected(files) {
      const imageFile = files[0];
      const organization = get(this, 'organization');

      this._loadImageFile(imageFile, false)
      .then((dataUrl) => {
        organization.setProperties({
          backgroundImageUrl: dataUrl,
          backgroundImage: imageFile
        });

        set(this, 'hasNewOrganizationBackgroundImage', true);
      })
      .catch(() => {
        this.send('setBackgroundImageToStock');

        set(this, 'hasNewOrganizationBackgroundImage', false);
      });
    },

    nameStepStart() {
      run.next(() => {
        set(this, 'organization.name', null);
      });
    },

    nameIsChanging() {
      set(this, 'organizationNameIsUnique', false);
      run.debounce(this, '_checkOrganizationName', 500);
    },

    emailStepStart() {
      run.next(() => {
        set(this, 'organization.email', null);
      });
    },

    useCurrentUserEmail() {
      const currentUserEmail = get(this, 'currentUser.email');

      set(this, 'organization.email', currentUserEmail);
    },

    emailIsChanging() {
      run.debounce(this, '_checkOrganizationEmail', 500);
    },

    websiteStepStart() {
      run.next(() => {
        set(this, 'organization.website', null);
      });
    },

    descriptionStepStart() {
      run.next(() => {
        set(this, 'organization.description', null);
      });
    },

    createBlog() {
      set(this, 'isCreatingOrganization', true);

      get(this, 'organization').save()
      .then((organization) => {
        this._addOrganizationToManagedList(organization);
        this.transitionToRoute('profile', organization.id);
        get(this, 'notify').success('Welcome to your new profile page.');

      })
      .catch(() => {
        get(this, 'notify').error('Something went wrong when saving your blog. Please try again.');
        set(this, 'isCreatingOrganization', false);
      });
    }
  }
});
