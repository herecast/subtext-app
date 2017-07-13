import Ember from 'ember';
import DS from 'ember-data';

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
  backgroundImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean'),
  canEdit: DS.attr('boolean'),
  profileAdOverride: DS.attr('number'),

  // Temporary for dashboard edit button
  businessProfileId: DS.attr(),

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

  hasProfile: computed('orgType', function(){
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
