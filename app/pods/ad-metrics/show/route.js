import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Metrics',
  metrics: Ember.inject.service('content-metrics'),

  model(params) {
    return this.get('metrics').findAd(params.content_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('secondaryBackground', true);
  }
});