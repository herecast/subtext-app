import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

const {get, inject} = Ember;

export default Ember.Route.extend(PaginatedFilter, History, ResetScroll, {
  userLocation: inject.service(),

  model(params) {
    const self = this;
    const promises = {
      category: self.store.findRecord('market-category', params.cat_id),
      posts: get(self, 'userLocation.location').then((location) => {
        return self.store.findRecord('market-category', params.cat_id).then((category) => {
          return self.store.query('market-post', {
            query: category.get('query'),
            page: params.page,
            per_page: params.per_page,
            location_id: get(location, 'id'),
            query_modifier: category.get('query_modifier')
          });
        });
      })
    };

    return Ember.RSVP.hash(promises);
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.setProperties({
      cat: model.category,
      posts: model.posts
    });

    // Set the query params on the parent market controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties('query', 'location', 'locationId');

    this.setupFilter('location.market.index', filterParams);
  }
});
