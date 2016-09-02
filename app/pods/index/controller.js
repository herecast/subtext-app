import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

export default Ember.Controller.extend(PaginatedFilter, {
  queryParams: ['page'],
  page: 1,
});
