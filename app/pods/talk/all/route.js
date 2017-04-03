import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, {
  model(params) {
    return this.store.query('talk', {
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query');

    this.setupFilter('talk/all', filterParams);
  },

  actions: {
    didAuthenticate() {
      this.refresh();
    }
  }
});
