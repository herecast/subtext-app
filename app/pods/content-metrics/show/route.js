import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: 'Metrics',
  metrics: Ember.inject.service('content-metrics'),

  model(params) {
    return this.get('metrics').findContent(params.content_id);
  }
});
