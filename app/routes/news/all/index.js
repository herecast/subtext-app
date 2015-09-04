import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';

export default Ember.Route.extend(Track, PaginatedFilter, {
  model(params) {
    if (typeof params.location === 'undefined') {
      params.location = this.get('session.userLocation');
    }

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

    const filterParams = controller.getProperties(
      'query', 'location', 'publication'
    );

    this.setupFilter('news/all', filterParams);
  }
});
