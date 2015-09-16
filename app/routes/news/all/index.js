import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';
import PaginatedFilter from '../../../mixins/routes/paginated-filter';
import History from '../../../mixins/routes/history';

export default Ember.Route.extend(Track, PaginatedFilter, History, {
  model(params) {
    let locationId = null;
    if (params.location === this.get('session.userLocation')) {
      locationId = this.get('session.currentUser.locationId');
    }
    return this.store.find('news', {
      query: params.query,
      location: params.location,
      location_id: locationId,
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
