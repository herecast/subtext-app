import Ember from 'ember';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute, {

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
