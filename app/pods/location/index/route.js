import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

const { inject, get } = Ember;

export default Ember.Route.extend(MaintainScroll, PaginatedFilter, History, {
  userLocation: inject.service('user-location'),

  queryParams: {
    page: {refreshModel: true}
  },

  model(params) {
    return get(this, 'userLocation.location').then((location) => {
      return this.store.query('news', {
        page: params.page,
        per_page: 4,
        location_id: get(location, 'id')
      });
    });
  }
});
