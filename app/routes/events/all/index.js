import Ember from 'ember';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';
import History from '../../../mixins/routes/history';

export default Ember.Route.extend(PaginatedFilter, History, {
  model(params) {
    return this.store.find('event-instance', {
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

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties(
      'category', 'query', 'startDate', 'stopDate', 'location'
    );

    this.setupFilter('events/all', filterParams);
  }
});
