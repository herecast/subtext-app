import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  mixpanel: Ember.inject.service('mixpanel'),
  secondaryBackground: true,

  queryParams: ['query', 'location', 'r', 'page', 'per_page'],

  // Change this value in the query params to force a refresh.
  r: false,

  page: 1,
  per_page: 24,

  defaultQuery: 'Everything',
  defaultLocation: 'All Communities',

  query: Ember.computed.oneWay('defaultQuery'),
  location: Ember.computed.oneWay('defaultLocation'),

  showReset: function() {
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultLocation || !isDefaultQuery;
  }.property('query', 'location'),

  actions: {
    resetFilters() {
      this.get('mixpanel').trackEvent('Market Search Reset');

      const params = {
        location: this.get('defaultLocation'),
        query: this.get('defaultQuery'),
        r: this.get('refreshParam.time')
      };

      this.send('resetFilter', 'market/all', params);
    }
  }
});
