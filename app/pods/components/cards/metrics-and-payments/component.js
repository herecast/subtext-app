import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  modals: service(),
  tracking: service(),

  hidePayments: false,

  model: null,
  modelName: computed('model', function() {
    const model = get(this, 'model');
    return get(model, 'constructor.modelName');
  }),
  modelId: computed('model', 'modelName', function() {
    const model = get(this, 'model');
    const modelName = get(this, 'modelName');

    return modelName === 'current-user' ? get(model, 'userId') : get(model, 'id');
  }),

  hasTrackedMetrics: false,
  hasTrackedPayments: false,

  color: 'default',
  noShadow: false,

  actions: {
    showMetrics() {
      get(this, 'modals').showModal('modals/aggregated-content-metrics', get(this, 'model'));

      if (!get(this, 'hasTrackedMetrics')) {
        get(this, 'tracking').trackMetricsRequest(get(this, 'modelName'), get(this, 'modelId'));
        set(this, 'hasTrackedMetrics', true);
      }
    },

    showPayments() {
      get(this, 'modals').showModal('modals/aggregated-content-payments', get(this, 'model'));

      if (!get(this, 'hasTrackedPayments')) {
        get(this, 'tracking').trackPaymentsRequest(get(this, 'modelName'), get(this, 'modelId'));
        set(this, 'hasTrackedPayments', true);
      }
    }
  }
});
