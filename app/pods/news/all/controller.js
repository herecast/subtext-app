import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const { computed } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackgroundMobile: true,

  queryParams: ['query', 'location', 'locationId', 'organization', 'page', 'per_page'],

  page: 1,
  per_page: 12,

  defaultQuery: 'Everything',
  defaultOrganization: 'Everyone',
  defaultLocation: 'All Communities',
  defaultLocationId: null,

  query: 'Everything',
  organization: 'Everyone',
  location: 'All Communities',
  locationId: null,

  showReset: computed('organization', 'query', 'location', function() {
    const isDefaultOrganization = this.get('defaultOrganization') === this.get('organization');
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultOrganization || !isDefaultLocation || !isDefaultQuery;
  }),

  actions: {
    resetFilters() {
      const params = {
        organization: this.get('defaultOrganization'),
        location: this.get('defaultLocation'),
        locationId: this.get('defaultLocationId'),
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'news/all', params);
    }
  }
});
