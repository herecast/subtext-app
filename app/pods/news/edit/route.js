import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Edit News',

  model(params) {
    return this.store.find('news', params.id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('title', 'Edit your news post');
    controller.set('secondaryBackground', true);
  }
});
