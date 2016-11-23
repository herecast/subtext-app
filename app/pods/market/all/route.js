import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, {
  queryParams: {
    flat: {
      refreshModel: true
    }
  },

  model(params) {
    if (params.query) {
      return this.store.query('market-post', {
        query: params.query,
        date_start: params.date_start,
        date_end: params.date_end,
        location: params.location,
        location_id: params.locationId,
        page: params.page,
        per_page: params.per_page
      });
    } else if (params.flat) {
      return this.store.query('market-post', {
        query: '',
        date_start: params.date_start,
        date_end: params.date_end,
        location: params.location,
        location_id: params.locationId,
        page: params.page,
        per_page: params.per_page
      });
    } else {
      return {};
    }
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query', 'location', 'locationId');

    this.setupFilter('market/all', filterParams);
  }
});
