import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.find('event');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('totalEvents', this.store.metadataFor('event').total);
  }
});
