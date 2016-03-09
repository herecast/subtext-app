import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('business-profile', params.id);
  },
  setupController(controller, model) {
    const searchController = this.controllerFor('directory.search');
    searchController.set('selectedResult', model);

    controller.set('secondaryBackground', true);
    controller.set('model', model);
  }
});
