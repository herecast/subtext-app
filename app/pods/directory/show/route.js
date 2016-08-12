import Ember from 'ember';
import ResetModalScroll from 'subtext-ui/mixins/routes/reset-modal-scroll';
const { get, set } = Ember;

export default Ember.Route.extend(ResetModalScroll, {

  model(params) {
    return this.store.findRecord('business-profile', params.id);
  },

  afterModel(model) {
    const titleToken = get(model, 'name');
    set(this, 'titleToken', titleToken);
  },

  setupController(controller, model) {
    controller.set('secondaryBackground', true);
    controller.set('model', model);
    controller.set('editFormIsVisible', false);
  }
});
