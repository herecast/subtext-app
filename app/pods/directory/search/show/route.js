import Ember from 'ember';
import ResetScroll from 'subtext-ui/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {
  model(params) {
    return this.store.findRecord('business-profile', params.id);
  },
  setupController(controller, model) {
    const searchController = this.controllerFor('directory.search');
    searchController.set('selectedResult', model);

    controller.set('secondaryBackground', true);
    controller.set('model', model);
    controller.set('editFormIsVisible', false);
  }
});
