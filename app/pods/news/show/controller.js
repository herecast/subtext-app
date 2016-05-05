import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  queryParams: ['scrollTo'],
  scrollTo: null,

  organizations: computed.oneWay('session.currentUser.managed_organizations'),

  hasCaptionOrCredit: computed('model.bannerImage.{caption,credit}', function() {
    return Ember.isPresent(this.get('model.bannerImage.caption')) ||
      Ember.isPresent(this.get('model.bannerImage.credit'));
  }),

  canEdit: computed('organizations.@each.id', 'model.organization.id', function() {
    const userOrganizations = get(this, 'organizations') || [];
    const newsOrganizationId = get(this, 'model.organization.id');
    const orgIds = userOrganizations.map((item) => { return get(item, 'id'); });

    return orgIds.indexOf(newsOrganizationId) !== -1;
  })
});
