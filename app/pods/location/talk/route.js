import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';
import Authorized from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  inject,
  RSVP: {Promise}
} = Ember;

export default Ember.Route.extend(Authorized, PaginatedFilter, History, MaintainScroll, {
  session: inject.service(),
  userLocation: inject.service('user-location'),

  model(params) {
    const isAuthenticated = get(this, 'session.isAuthenticated');

    if (isAuthenticated) {
      return get(this, "userLocation.location").then((location) => {
        return this.store.query('talk', {
          query: params.query,
          location_id: get(location, 'id'),
          date_start: params.date_start,
          radius: params.radius,
          date_end: params.date_end,
          page: params.page,
          per_page: params.per_page
        });
      });
    } else {
      return Promise.resolve([]);
    }
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query');

    this.setupFilter('location.talk', filterParams);
  },

  actions: {
    didAuthenticate() {
      this.refresh();
    }
  }
});
