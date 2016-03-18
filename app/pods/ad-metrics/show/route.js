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
    const query = {},
      start_date = params['startDate'],
      end_date = params['endDate'];

    if (start_date) {
      query.start_date = start_date;
    }

    if (end_date) {
      query.end_date = end_date;
    }

    return this.get('metrics').findAd(params.content_id, query);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('secondaryBackground', true);
  }
});
