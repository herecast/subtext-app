import Ember from 'ember';
import DS from 'ember-data';

const {
  computed,
  get,
  inject,
  isPresent
} = Ember;

export default DS.Model.extend({
  api: inject.service('api'),

  name: DS.attr('string'),
  profileTitle: DS.attr('string'),
  logoUrl: DS.attr('string'),
  avatarUrl: DS.attr('string'),
  subscribeUrl: DS.attr('string'),
  orgType: DS.attr('string'),
  backgroundImageUrl: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean'),
  canEdit: DS.attr('boolean'),

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

  // Placeholders for image objects to be uploaded
  logo: null,
  avatar: null,
  backgroundImage: null,

  displayImageUrl: computed('logoUrl', 'avatarUrl', function() {
    const avatar = get(this, 'avatarUrl');
    return avatar ? avatar : get(this, 'logoUrl');
  }),

  uploadImage(type, image) {
    if (isPresent(image)) {
      const id = get(this, 'id');
      const api = get(this, 'api');

      const data = new FormData();
      data.append(`organization[${type}]`, image);

      return api.updateOrganizationLogo(id, data);
    }
  },

  uploadLogo() {
    return this.uploadImage('logo', get(this, 'logo'));
  },

  uploadAvatar() {
    return this.uploadImage('avatar', get(this, 'avatar'));
  },

  uploadBackgroundImage() {
    return this.uploadImage('background_image', get(this, 'backgroundImage'));
  }
});
