import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';
import History from '../../../mixins/routes/history';

export default Ember.Route.extend(Track, PaginatedFilter, History, {
  model(params) {
    return this.store.find('news', {
      query: params.query,
      location: params.location,
      location_id: params.locationId,
      publication: params.publication,
      page: params.page,
      per_page: params.per_page
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const filterParams = controller.getProperties(
      'query', 'location', 'publication', 'locationId'
    );

    this.setupFilter('news/all', filterParams);
  }
});
