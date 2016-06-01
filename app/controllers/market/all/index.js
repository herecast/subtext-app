import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

const { computed } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  page: 1,
  per_page: 24,

  queryParams: ['query', 'location', 'locationId', 'page', 'per_page'],

  defaultQuery: 'Everything',
  defaultLocation: 'All Communities',
  defaultLocationId: null,

  query: 'Everything',
  location: 'All Communities',
  locationId: null,

  showReset: computed('query', 'location', function() {
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultLocation || !isDefaultQuery;
  }),

  actions: {
    resetFilters() {
      const params = {
        location: this.get('defaultLocation'),
        locationId: this.get('defaultLocationId'),
        query: this.get('defaultQuery')
      };

      this.send('resetFilter', 'market/all', params);
    }
  }
});
