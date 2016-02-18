import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.query('business-profile', {
      category_id: params['subCategoryId'],
      query: params['query'],
      near: params['location']
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
  }
});
