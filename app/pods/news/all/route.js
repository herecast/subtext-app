import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, RouteNameAdContext, {
  model(params) {
    return this.store.query('news', {
      query: params.query,
      location: params.location,
      location_id: params.locationId,
      organization: params.organization,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const filterParams = controller.getProperties(
      'query', 'location', 'organization', 'locationId'
    );

    this.setupFilter('news/all', filterParams);
  }
});
