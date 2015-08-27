import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';

export default Ember.Route.extend(Track, PaginatedFilter, {
  model(params) {
    return this.store.find('talk', {
      query: params.query,
      date_start: params.date_start,
      date_end: params.date_end,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query');

    this.controllerFor('talk/all').setProperties(filterParams);
  }
});