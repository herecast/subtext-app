import { computed, set, get } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Cards-MetricsAndPayments'],

  api: service(),
  modals: service(),
  notifications: service('notification-messages'),
  session: service(),
  tracking: service(),

  hidePayments: false,
  showPayments: not('hidePayments'),

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

  currentUser: alias('session.currentUser'),
  publisherAgreementConfirmed: alias('currentUser.publisherAgreementConfirmed'),
  showPublisherAgreementButton: not('publisherAgreementConfirmed'),
  hasClickedPublisherAgreementLink: false,

  hasTrackedMetrics: false,
  hasTrackedPayments: false,

  color: 'default',
  noShadow: false,

  isAgreeing: false,

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
    },

    onClickPublisherAgreementLink() {
      set(this, 'hasClickedPublisherAgreementLink', true);
    },

    agreeToPublisherAgreement() {
      set(this, 'isAgreeing', true);

      get(this, 'api').agreeToPublisherAgreement(get(this, 'currentUser.userId'))
      .then(() => {
        set(this, 'publisherAgreementConfirmed', true);
      })
      .catch(() => {
        get(this, 'notifications').error('There was an issue recording your agreement. Please reload the page and try again.');
      })
      .finally(() => {
        set(this, 'isAgreeing', false);
      });
    }
  }
});
