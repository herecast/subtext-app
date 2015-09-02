import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';

export default Ember.Route.extend(Track, PaginatedFilter, {
  model(params) {
    if (typeof params.location === 'undefined') {
      params.location = this.get('session.userLocation');
    }

    return this.store.find('market-post', {
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

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query', 'location');

    if (typeof filterParams.location === 'undefined') {
      filterParams.location = this.get('session.userLocation');
    }

    this.controllerFor('market/all').setProperties(filterParams);
  }
});
