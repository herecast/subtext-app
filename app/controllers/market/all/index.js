import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['query', 'location', 'locationId', 'page', 'per_page'],

  page: 1,
  per_page: 24,

  defaultQuery: 'Everything',
  defaultLocation: 'All Communities',
  defaultLocationId: null,

  query: Ember.computed.oneWay('defaultQuery'),
  location: Ember.computed.oneWay('defaultLocation'),
  locationId: Ember.computed.oneWay('defaultLocationId'),

  showReset: function() {
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultLocation || !isDefaultQuery;
  }.property('query', 'location'),

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
