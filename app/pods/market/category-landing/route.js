import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

export default Ember.Route.extend(PaginatedFilter, History, MaintainScroll, {

  model(params) {
    const self = this;

    const promises = {
      category: self.store.findRecord('market-category', params.id),
      posts: self.store.findRecord('market-category', params.id).then((category) => {
        return self.store.query('market-post', {
          query: category.get('query'),
          page: params.page,
          per_page: params.per_page
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

    this.setupFilter('market/all', filterParams);
  }
});
