import {
  alias,
  notEmpty,
  not,
  readOnly,
  and
} from '@ember/object/computed';
import $ from 'jquery';
import Controller from '@ember/controller';
import { computed, setProperties, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import { htmlSafe } from '@ember/template';
/* global loadImage */

export default Controller.extend({
  startIntro: true,

  session: service(),
  notify: service('notification-messages'),
  api: service(),
  media: service(),
  fastboot: service(),
  tracking: service(),

  currentUser: alias('session.currentUser'),
  hasCurrentUser: notEmpty('currentUser'),
  hasNoCurrentUser: not('hasCurrentUser'),
  currentUserIsBlogger: readOnly('currentUser.isBlogger'),

  isFastBoot: readOnly('fastboot.isFastBoot'),
  isMobile: readOnly('media.isMobile'),

  init() {
    this._super(...arguments);
    setProperties(this, {
      avatarUrls: {
        delighted: 'https://s3.amazonaws.com/subtext-misc/createapage/JenniferBot_delighted.png',
        smiling: 'https://s3.amazonaws.com/subtext-misc/createapage/JenniferBot_smiling.png',
        thinking: 'https://s3.amazonaws.com/subtext-misc/createapage/JenniferBot_thinking.png',
        thumbsup: 'https://s3.amazonaws.com/subtext-misc/createapage/JenniferBot_thumbsup.png',
        profile: 'http://d3ctw1a5413a3o.cloudfront.net/organization/2454/7a342b89283a777f-blob.png',
        background: 'https://s3.amazonaws.com/subtext-misc/createapage/JenniferBot_background.png'
      }
    });
  },

  genericProfileImageUrl: 'https://s3.amazonaws.com/subtext-misc/createapage/generic-profile-picture.jpg',

  organization: alias('model'),

  backgroundImageInputClass: 'BloggerIntro-Step-background-image-input',
  profileImageInputClass: 'BloggerIntro-Step-profile-image-input',

  hasStartedWritingName: false,
  minNameLength: 4,
  maxNameLength: 20,
  hasOrganizationName: computed('organization.name.length', function() {
    return get(this, 'organization.name.length') >= get(this, 'minNameLength');
  }),
  organizationNameIsUnique: false,
  organizationNameIsGood: and('hasOrganizationName', 'organizationNameIsUnique'),
  isCheckingOrganizationName: false,

  nameLengthText: computed('organization.name', function() {
    const minNameLength = get(this, 'minNameLength');
    const maxNameLength = get(this, 'maxNameLength');
    const nameLength = get(this, 'organization.name.length') || 0;

    if (nameLength >= minNameLength) {
      return `${nameLength}/${maxNameLength} Maximum`;
    } else {
      return `${nameLength}/${minNameLength} Minimum`;
    }
  }),

  nameInputWidthStyle: computed('organization.name', function() {
    const lengthThatFitsMin = 25;
    const nameLength = get(this, 'organization.name.length') || 0;

    let width = 300;

    if (nameLength > lengthThatFitsMin) {
      const maxWidth = $('.OrganizationProfileHeaderCard-name')[0].offsetWidth - 8;

      const charactersBeyond = nameLength - lengthThatFitsMin;
      const sizeItShouldBe = width + charactersBeyond * 10;

      if (sizeItShouldBe < maxWidth) {
        width = sizeItShouldBe;
      } else {
        width = maxWidth;
      }
    }

    return htmlSafe(`width:${width}px;`);
  }),

  hasNewOrganizationProfileImage: false,

  hasNewOrganizationBackgroundImage: false,

  isCreatingOrganization: false,

  hasValidEmail: false,
  wantsNewEmail: false,
  connectEmailButtonText: computed('organization.email', function() {
    return `Use ${get(this, 'currentUser.email')}`;
  }),

  hasValidWebsite: computed('organization.website', function() {
    const website = get(this, 'organization.website') || '';
    const regexp = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/ig;

    return website.match(regexp);
  }),

  minDescriptionLength: 1,
  hasValidDescription: computed('organization.description.length', 'minDescriptionLength', function() {
    return get(this, 'organization.description.length') > get(this, 'minDescriptionLength');
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

  actions: {
    leadCaptured() {
      get(this, 'tracking').trackVirtualPageview('/createapage/leadcaptured');
    },

    stepStartAccount() {
      get(this, 'tracking').trackVirtualPageview('/createapage/account');
    },

    stepStartProfilePic() {
      get(this, 'tracking').trackVirtualPageview('/createapage/profilepic');
    },

    stepStartLegal() {
      get(this, 'tracking').trackVirtualPageview('/createapage/agreement');
    },

    uploadProfileImage() {
      const fileInput = $(document).find(`.${get(this, 'profileImageInputClass')}`)[0];
      fileInput.click();
    },

    setProfileImage() {
      if (!get(this, 'hasNewOrganizationProfileImage')) {
        const organization = get(this, 'organization');

        organization.setProperties({
          profileImage: null,
          profileImageUrl: get(this, 'genericProfileImageUrl'),
          remoteProfileImageUrl: get(this, 'genericProfileImageUrl')
        });
      }
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

    nameStepStart() {
      get(this, 'tracking').trackVirtualPageview('/createapage/blogname');

      run.next(() => {
        set(this, 'organization.name', null);
        $('#blog-name').focus();
      });
    },

    nameIsChanging() {
      set(this, 'organizationNameIsUnique', false);
      run.debounce(this, '_checkOrganizationName', 500);
    },

    descriptionStepStart() {
      get(this, 'tracking').trackVirtualPageview('/createapage/description');

      run.next(() => {
        const orgName = get(this, 'organization.name');
        const defaultDescription = `Welcome to ${orgName}, where I'll be posting about the things that are important to me.`;
        set(this, 'organization.description', defaultDescription);
      });
    },

    createBlog() {
      set(this, 'isCreatingOrganization', true);

      get(this, 'organization').save()
      .then((organization) => {
        get(this, 'tracking').trackVirtualPageview('/createapage/newblogcomplete');

        this._addOrganizationToManagedList(organization);
        this.transitionToRoute('profile', organization.id);
        set(this, 'session.userCanPublishNews', true);
        get(this, 'notify').success(`Welcome to your new page. You're ready to start posting content on the site!`);
      })
      .catch(() => {
        get(this, 'notify').error('Something went wrong when saving your page. Please try again.');
        set(this, 'isCreatingOrganization', false);
      });
    }
  }
});