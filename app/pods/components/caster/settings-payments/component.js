import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  api: service(),
  modals: service(),
  tracking: service(),

  caster: null,

  publisherAgreementConfirmed: alias('caster.publisherAgreementConfirmed'),
  showPublisherAgreementButton: not('publisherAgreementConfirmed'),
  hasClickedPublisherAgreementLink: false,

  _hasTrackedMetrics: false,
  _hasTrackedPayments: false,

  actions: {
    showMetrics() {
      get(this, 'modals').showModal('modals/aggregated-content-metrics', get(this, 'caster'));

      if (!get(this, '_hasTrackedMetrics')) {
        get(this, 'tracking').trackMetricsRequest(get(this, 'caster.id'));
        set(this, '_hasTrackedMetrics', true);
      }
    },

    showPayments() {
      get(this, 'modals').showModal('modals/aggregated-content-payments', get(this, 'caster'));

      if (!get(this, '_hasTrackedPayments')) {
        get(this, 'tracking').trackPaymentsRequest(get(this, 'caster.id'));
        set(this, '_hasTrackedPayments', true);
      }
    },

    onClickPublisherAgreementLink() {
      set(this, 'hasClickedPublisherAgreementLink', true);
    },

    agreeToPublisherAgreement() {
      set(this, 'isAgreeing', true);

      get(this, 'api').agreeToPublisherAgreement(get(this, 'caster.userId'))
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
