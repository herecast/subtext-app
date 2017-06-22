import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

const { inject, get } = Ember;

export default Ember.Route.extend(MaintainScroll, PaginatedFilter, History, RouteNameAdContext, {
  userLocation: inject.service(),

  queryParams: {
    flat: {
      refreshModel: true
    }
  },

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      const locationId = get(location, 'id');
      if (params.query) {
        return this.store.query('market-post', {
          query: params.query,
          date_start: params.date_start,
          date_end: params.date_end,
          location_id: locationId,
          page: params.page,
          per_page: params.per_page
        });
      } else if (params.flat) {
        return this.store.query('market-post', {
          query: '',
          date_start: params.date_start,
          date_end: params.date_end,
          location_id: locationId,
          page: params.page,
          per_page: params.per_page
        });
      } else {
        return {};
      }
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query');

    this.setupFilter('location.market.index', filterParams);
  }
});
