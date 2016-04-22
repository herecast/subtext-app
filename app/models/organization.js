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
  logoUrl: DS.attr('string'),
  logo: DS.attr(),
  subscribeUrl: DS.attr('string'),
  orgType: DS.attr('string'),
  backgroundImage: DS.attr(),
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
  
  isBlog: computed.equal('orgType', 'blog'),
  isBusiness: computed.equal('orgType', 'business'),
  
  uploadLogo() {
    const id = get(this, 'id');
    const api = get(this, 'api');
    const data = new FormData();

    if (isPresent(this.get('logo'))) {
      data.append('organization[logo]', this.get('logo'));

      return api.updateOrganizationLogo(id, data);
    }
  },
});
