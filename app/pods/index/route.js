import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';

export default Ember.Route.extend(PaginatedFilter, History, {

  queryParams: {
    page: {refreshModel: true}
  },

  model(params) {
    return this.store.query('news', {page: params.page, per_page: 4});
  }
});
