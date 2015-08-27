import Ember from 'ember';
import PaginatedFilter from '../mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  queryParams: ['page', 'per_page'],

  page: 1,
  per_page: 14
});
