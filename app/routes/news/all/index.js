import Ember from 'ember';
import Track from '../../../mixins/routes/track-pageview';

export default Ember.Route.extend(Track, {
  queryParams: {
    r: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.find('news', {
      query: params.query
    });
  },

  setupController(controller, news) {
    controller.set('newsGroups', [news]);

    // Set the query params on the parent events controller so that it's
    // available in the filter on the index and show pages.
    const filterParams = controller.getProperties(
      'query', 'location', 'publication'
    );

    this.controllerFor('news/all').setProperties(filterParams);
  },

  actions: {
    updateFilter(filterParams) {
      this.transitionTo({queryParams: filterParams});
      this.refresh();
    }
  }
});
