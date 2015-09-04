import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  refreshParam: Ember.inject.service('refresh-param'),
  mixpanel: Ember.inject.service('mixpanel'),
  secondaryBackgroundMobile: true,

  queryParams: ['query', 'location', 'publication', 'r', 'page', 'per_page'],

  // Change this value in the query params to force a refresh.
  r: false,

  page: 1,
  per_page: 14,

  defaultQuery: 'Everything',
  defaultPublication: 'Everyone',
  defaultLocation: 'All Communities',

  query: Ember.computed.oneWay('defaultQuery'),
  publication: Ember.computed.oneWay('defaultPublication'),
  location: Ember.computed.oneWay('defaultLocation'),

  showReset: function() {
    const isDefaultPublication = this.get('defaultPublication') === this.get('publication');
    const isDefaultQuery = this.get('defaultQuery') === this.get('query');
    const isDefaultLocation = this.get('defaultLocation') === this.get('location');

    return !isDefaultPublication || !isDefaultLocation || !isDefaultQuery;
  }.property('publication', 'query', 'location'),

  actions: {
    resetFilters() {
      this.get('mixpanel').trackEvent('News Search Reset');

      const params = {
        publication: this.get('defaultPublication'),
        location: this.get('defaultLocation'),
        query: this.get('defaultQuery'),
        r: this.get('refreshParam.time')
      };

      this.send('resetFilter', 'news/all', params);
    }
  }
});
