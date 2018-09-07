import Ember from 'ember';

const { get, set, computed, isPresent, inject:{service} } = Ember;

export default Ember.Controller.extend({
  queryParams: ['organizationId', 'type', 'query', 'page'],
  organizationId: '',
  type: '',
  query: '',
  page: 1,

  condensedView: false,
  isLoading: false,
  chosenOrganization: null,

  contentTypes: ['posts', 'calendar', 'market'],

  session: service(),

  hasResults: computed('model.[]', function() {
    return get(this, 'model.length');
  }),

  hasActiveFilters: computed('organizationId', 'type', 'query', function() {
    return  isPresent(get(this, 'organizationId')) ||
            isPresent(get(this, 'type')) ||
            isPresent(get(this, 'query'));
  }),

  organizations: computed.readOnly('session.currentUser.managedOrganizations'),

  activeOrganization: computed('organizationId', 'hasOrganizations', 'organizations.[]', function() {
    const organizations = get(this , 'organizations');
    const activeOrganizationId = get(this, 'organizationId');

    if (activeOrganizationId === false || activeOrganizationId === 'false') {
      return false;
    }

    if (get(this, 'hasOrganizations')) {
      return organizations.find(organization => organization.id === activeOrganizationId);
    }

    return null;
  }),

  activeType: computed.readOnly('type'),

  hasOrganizations: computed.gt('organizations.length', 0),

  actions: {
    toggleCondensedView() {
      this.toggleProperty('condensedView');
    },

    updateQuery(query) {
      this.setProperties({
        query: query,
        page: 1
      });
    },

    updateOrganizationId(organizationId='') {
      set(this, 'organizationId', organizationId);
    },

    updateType(type='') {
      set(this, 'type', type);
    }
  }
});
