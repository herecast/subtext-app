import Ember from 'ember';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';
import History from '../../../mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';

const { set } = Ember;

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, RouteNameAdContext, {
  model(params) {
    return this.store.query('event-instance', {
      category: params.category,
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end,
      location: params.location,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    set(controller, 'total', model.meta.total);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties(
      'category', 'query', 'startDate', 'stopDate', 'location'
    );

    this.setupFilter('events/all', filterParams);
  }
});
