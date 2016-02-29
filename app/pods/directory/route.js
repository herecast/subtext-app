import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Route.extend({
  model(params) {
    return RSVP.hash({
      categories: this.store.find('business-category'),
      results: this.store.query('business-profile', {
        query: params.query,
        category_id: params.subcategory_id,
        lat: params.lat,
        lng: params.lng
      })
    });
  },

  setupController(controller, model) {
    controller.set('categories', model.categories);
    controller.set('results', model.results);
  }
});
