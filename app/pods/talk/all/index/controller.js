import Ember from 'ember';
import PaginatedFilter from '../../../../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['query', 'page', 'per_page'],

  page: 1,
  per_page: 24,

  defaultQuery: 'Everything',
  query: 'Everything'
});
