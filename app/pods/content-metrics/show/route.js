import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    startDate: {
      refreshModel: true
    },
    endDate: {
      refreshModel: true
    }
  },
  titleToken: 'Metrics',
  metrics: Ember.inject.service('content-metrics'),

  model(params) {
    const query = {
      start_date: params['startDate'],
      end_date: params['endDate']
    };
    return this.get('metrics').findContent(params.content_id, query);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('secondaryBackground', true);
  }
});
