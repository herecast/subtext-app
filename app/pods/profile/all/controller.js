import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {get, setProperties, isPresent, computed, inject} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  session: inject.service(),

  organization: null, // assigned in route's setupController

  queryParams: ['page', 'query', 'show'],
  page: 1,
  query: '',
  show: null,

  managedOrganizations: computed.alias('session.currentUser.managedOrganizations'),

  isAdmin: computed('session.isAuthenticated', 'managedOrganizations.@each.id', 'organization.id', function() {
    const managedOrganizations = get(this, 'managedOrganizations') || [];
    return isPresent(managedOrganizations.findBy('id', get(this, 'organization.id')));
  }),

  actions: {
    updateQuery(searchText) {
      setProperties(this, {
        query: searchText,
        page: 1
      });
    }
  }
});
