import Ember from 'ember';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';
import History from '../../../mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, {
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
