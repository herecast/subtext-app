import Route from '@ember/routing/route';
import { set, get } from '@ember/object';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

export default Route.extend(ModalRoute, {

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
