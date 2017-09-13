import Ember from 'ember';

const {computed, get} = Ember;

export default Ember.Controller.extend({
  query: '',
  queryParams: ['query'],
  managedOrganizations: computed.oneWay('session.currentUser.managedOrganizations'),
  channelLinksEnabled: false,

  isOrganizationManager: computed('managedOrganizations', function() {
    const organizationId = get(this, 'organization.id');
    const managedOrganizations = get (this, 'managedOrganizations');

    let managedOrganizationIds = [];

    if (managedOrganizations) {
      managedOrganizations.forEach((org) => {
        managedOrganizationIds.push(org.id);
      });
    }

    return managedOrganizationIds.includes(organizationId);
  })
});
