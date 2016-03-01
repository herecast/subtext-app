import Ember from 'ember';

const {
  RSVP,
  merge,
  isPresent
} = Ember;

export default Ember.Route.extend({
  model(params) {
    const baseQuery = {
      categories: this.store.find('business-category')
    };
    const resultsQuery = {
      results: this.store.query('business-profile', {
        query: params.query,
        category_id: params.subcategory_id,
        lat: params.lat,
        lng: params.lng
      })
    };
    const query = (params.query || params.subcategory_id) ? merge(baseQuery, resultsQuery) : baseQuery;

    return RSVP.hash(query);
  },

  setupController(controller, model) {
    controller.set('categories', model.categories);

    if (isPresent(model.results)) {
      controller.set('results', model.results);
    }
  }
});
