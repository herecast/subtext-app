import Ember from 'ember';
import PaginatedFilter from '../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['query', 'location', 'r', 'page', 'per_page'],

  // Change this value in the query params to force a refresh.
  r: false,

  page: 1,
  per_page: 25,

  query: 'Everything',
  location: Ember.computed.oneWay('session.userLocation')
});
