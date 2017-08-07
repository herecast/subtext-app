import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(PaginatedFilter, History, ResetScroll, {
  model(params) {
    return this.store.findRecord('market-category', params.cat_id).then((category) => {
      return this.store.query('market-post', {
        query: category.get('query'),
        page: params.page,
        per_page: params.per_page,
        query_modifier: category.get('query_modifier')
      }).then((marketPosts) => {
        return {category: category, posts: marketPosts};
      });
    });
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
