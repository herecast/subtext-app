import Ember from 'ember';
import DS from 'ember-data';
import isDefaultOrganization from 'subtext-ui/utils/is-default-organization';

const {
  computed,
  get,
  inject,
  isPresent,
  setProperties
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
  backgroundImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean'),
  canEdit: DS.attr('boolean'),
  profileAdOverride: DS.attr('number'),
  customLinks: DS.attr(),

  // Temporary for dashboard edit button
  businessProfileId: DS.attr(),

  // Contact info: copied from business-profile model to be consolidated
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

  websiteLink: computed('website', function() {
    let siteLink = get(this, 'website');
    if (isPresent(siteLink) && siteLink.match(`^(http|https)://`) === null) {
      siteLink = "http://" + siteLink;
    }
    return siteLink;
  }),

  emailLink: computed('email', function() {
    return `mailto:${this.get('email')}`;
  }),

  fullAddress: computed('address', 'city', 'state', 'zip', function() {
    const address = this.get('address');
    const city = this.get('city');
    const state = this.get('state');

    return `${address}, ${city}, ${state}`;
  }),

  directionsLink: computed('fullAddress', function() {
    const addressLink = get(this, 'fullAddress') + "," + get(this, 'zip');
    return 'http://maps.google.com/?q=' + encodeURIComponent(addressLink);
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

  publisher: DS.belongsTo('organization', {async: true, inverse: 'publications'}),
  publications: DS.hasMany('organization', {async: true, inverse: 'publisher'}),

  // Placeholders for image objects to be uploaded
  logo: null,
  profileImage: null,
  backgroundImage: null,

  // Used for avatars - default to profile image
  displayImageUrl: computed('logoUrl', 'profileImageUrl', function() {
    const profileImageUrl = get(this, 'profileImageUrl');
    return profileImageUrl ? profileImageUrl : get(this, 'logoUrl');
  }),

  isDefaultOrganization: computed('id', function() {
    return isDefaultOrganization(get(this, 'id'));
  }),

  organizationLinkRoute: computed('bizFeedActive', function() {
    const bizFeedActive = get(this, 'bizFeedActive');
    return bizFeedActive ? 'biz.show' : 'organization-profile';
  }),

  organizationLinkId: computed('bizFeedActive', function() {
    const bizFeedActive = get(this, 'bizFeedActive');
    return bizFeedActive ? get(this, 'id') : get(this, 'slug');
  }),

  hasContactInfo: computed('phone', 'email', 'address', function() {
    return isPresent(get(this, 'phone')) || isPresent(get(this, 'email')) || isPresent(get(this, 'address'));
  }),

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
