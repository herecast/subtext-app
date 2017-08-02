import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';

const {get, inject} = Ember;

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, RouteNameAdContext, {
  userLocation: inject.service(),

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      return this.store.query('news', {
        query: params.query,
        location_id: get(location, 'id'),
        radius: params.radius,
        organization: params.organization,
        page: params.page,
        per_page: params.per_page
      });
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const filterParams = controller.getProperties(
      'query', 'organization'
    );

    this.setupFilter('location/news', filterParams);
  }
});
