import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

const {inject, get} = Ember;

export default Ember.Route.extend(MaintainScroll, PaginatedFilter, History, RouteNameAdContext, {
  userLocation: inject.service(),

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      const locationId = get(location, 'id');
      return this.store.query('market-post', {
        query: '',
        date_start: params.date_start,
        date_end: params.date_end,
        location_id: locationId,
        radius: params.radius,
        page: params.page,
        per_page: params.per_page
      });
    });
  }
});
