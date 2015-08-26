import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';

export default Ember.Route.extend(Track, PaginatedFilter, {
  model(params) {
    return this.store.find('news', {
      query: params.query,
      location: params.location,
      publication: params.publication,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties(
      'query', 'location', 'publication'
    );

    this.controllerFor('news/all').setProperties(filterParams);
  }
});
