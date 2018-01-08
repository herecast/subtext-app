import Ember from 'ember';
import DS from 'ember-data';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';

const {
  computed,
  get,
  inject,
  isPresent,
  setProperties,
  RSVP
} = Ember;

export default DS.Model.extend({
  api: inject.service('api'),
  name: DS.attr('string'),
  profileTitle: DS.attr('string'),
  logoUrl: DS.attr('string'),
  profileImageUrl: DS.attr('string'),
  subscribeUrl: DS.attr('string'),
  twitterHandle: DS.attr('string'),
  orgType: DS.attr('string'),
  bizFeedActive: DS.attr('boolean'),
  claimed: DS.attr('boolean'),
  backgroundImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean'),
  subtextCertified: DS.attr('boolean'),
  services: DS.attr('string'),
  canEdit: DS.attr('boolean'),
  profileAdOverride: DS.attr('number'),
  customLinks: DS.attr(),

  contactCardActive: DS.attr('boolean', {defaultValue: true}),
  descriptionCardActive: DS.attr('boolean', {defaultValue: true}),
  hoursCardActive: DS.attr('boolean', {defaultValue: true}),

  // Temporary for dashboard edit button
  businessProfileId: DS.attr(),

  phone: DS.attr('string'),
  website: DS.attr('string'),

  hours: DS.attr('raw', {
    defaultValue: () => {
      return [];
    }
  }),
  email: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),

  // properties for social sharing tags
  title: computed.reads('name'),
  content: computed.reads('description'),
  featuredImageUrl: computed.reads('profileImageUrl'),
  normalizedContentType: 'organization',

  websiteLink: computed('website', function() {
    let siteLink = get(this, 'website');
    if (isPresent(siteLink) && siteLink.match(`^(http|https)://`) === null) {
      siteLink = "http://" + siteLink;
    }
    return siteLink;
  }),

  emailLink: computed('email', function() {
    const email = get(this, 'email') || false;
    return email ? `mailto:${this.get('email')}` : '';
  }),

  twitterHandleLink: computed('twitterHandle', function() {
    const twitterHandle = get(this, 'twitterHandle');
    return isPresent(twitterHandle) ? `https://twitter.com/${twitterHandle}` : null;
  }),

  fullAddress: computed('address', 'city', 'state', 'zip', function() {
    const address = this.get('address');
    const city = this.get('city');
    const state = this.get('state');
    const zip = this.get('zip');

    return [address, city, state, zip].filter(isPresent).join(', ');
  }),

  directionsLink: computed('fullAddress', function() {
    const fullAddress = get(this, 'fullAddress') || false;

    return fullAddress ? 'http://maps.google.com/?q=' + encodeURIComponent(fullAddress) : '';
  }),

  slug: computed('name', 'id', function() {
    const id = get(this, 'id');
    const name = get(this, 'name');
    const paramName = isPresent(name) ? name.trim().dasherize() : "";

    return `${id}-${paramName}`;
  }),

  isBlog: computed.equal('orgType', 'Blog'),
  isBusiness: computed.equal('orgType', 'Business'),
  isPublisher: computed.equal('orgType', 'Publisher'),
  isPublication: computed.equal('orgType', 'Publication'),

  hasProfile: computed('orgType', function() {
    const validOrgTypes = ['Blog', 'Business', 'Publisher', 'Publication'];
    const orgType = get(this, 'orgType');

    return validOrgTypes.includes(orgType);
  }),

  profileIsActive: computed('bizFeedActive', 'isBusiness', 'hasProfile', function() {
    const isBusiness = get(this, 'isBusiness');

    if (isBusiness) {
      return get(this, 'bizFeedActive');
    }

    return get(this, 'hasProfile');
  }),

  publisher: DS.belongsTo('organization', {async: true, inverse: 'publications'}),
  publications: DS.hasMany('organization', {async: true, inverse: 'publisher'}),

  // Placeholders for image objects to be uploaded
  logo: null, // note: logo is now deprecated
  profileImage: null,
  backgroundImage: null,

  // Used for avatars - default to profile image
  displayImageUrl: computed.reads('profileImageUrl'),

  isDefaultOrganization: computed('id', function() {
    return isDefaultOrganization(get(this, 'id'));
  }),

  organizationLinkRoute: 'profile',
  organizationLinkId: computed.alias('id'),

  hasContactInfo: computed('phone', 'email', 'address', 'website', 'twitterHandle', function() {
    return ['phone', 'email', 'address', 'website', 'twitterHandle'].any(
      (key) => isPresent(get(this, key))
    );
  }),

  organizationId: computed.reads('id'),

  save() {
    const saveItBaby = this._super(...arguments);

    return new RSVP.Promise((resolve, reject) => {
      saveItBaby.then((result) => {
        const rsvpHash = {};

        if (isPresent(get(this, 'logo'))) {
          rsvpHash.logo = this.uploadLogo();
        }

        if (isPresent(get(this, 'profileImage'))) {
          rsvpHash.profileImage = this.uploadProfileImage();
        }

        if (isPresent(get(this, 'backgroundImage'))) {
          rsvpHash.backgroundImage = this.uploadBackgroundImage();
        }

        if (isPresent(rsvpHash)) {
          RSVP.hash(rsvpHash).then(() => {
            // Reload to update the image urls
            this.reload().then(resolve, reject);
          }, reject);
        } else {
          resolve(result);
        }
      }, reject);
    });
  },

  uploadImage(type, image) {
    if (isPresent(image)) {
      const id = get(this, 'id');
      const api = get(this, 'api');

      const data = new FormData();
      data.append(`organization[${type}]`, image);

      return api.updateOrganizationImage(id, data);
    }
  },

  uploadLogo() {
    return this.uploadImage('logo', get(this, 'logo'));
  },

  uploadProfileImage() {
    return this.uploadImage('profile_image', get(this, 'profileImage'));
  },

  uploadBackgroundImage() {
    return this.uploadImage('background_image', get(this, 'backgroundImage'));
  },

  hasNewImage: computed('logo', 'profileImage', 'backgroundImage', function() {
    return isPresent(get(this, 'logo')) || isPresent(get(this, 'profileImage')) || isPresent(get(this, 'backgroundImage'));
  }),

  clearNewImages() {
    setProperties(this, {
      logo: null,
      profileImage: null,
      backgroundImage: null
    });
  }
});
