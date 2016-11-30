import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const { computed, get } = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  secondaryBackground: true,

  queryParams: ['category', 'query', 'date_start', 'date_end', 'location', 'page', 'per_page'],

  page: 1,
  per_page: 24,
  total: null,

  defaultCategory: 'Everything',
  defaultQuery: null,
  defaultLocation: 'All Communities',
  defaultStart: null,
  defaultEnd: null,

  category: 'Everything',
  location: 'All Communities',
  query: null,
  date_start: null,
  date_end: null,

  // Used to make the variable names more JSish and still let us pass the
  // right params to the API.
  startDate: null,
  stopDate: null,

  showNextPage: computed('model.[]', 'page', function() {
    const page        = get(this, 'page'),
          pageSize    = get(this, 'per_page'),
          total       = get(this, 'total');

    return total > page * pageSize;
  })
});
