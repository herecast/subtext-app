import config from 'subtext-ui/config/environment';
import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { get, computed } = Ember;

export default DS.Model.extend({
  periodStart: DS.attr('string'),
  periodEnd: DS.attr('string'),
  paidImpressions: DS.attr('number'),
  payPerImpression: DS.attr('number'),
  totalPayment: DS.attr('number'),
  paymentDate: DS.attr('moment-date'),
  reportUrl: DS.attr('string'),

  paymentDateAdjustmentDay: 10,

  reportUrlLink: computed('reportUrl', function() {
    return `${config.CONSUMER_APP_URI}/${get(this, 'reportUrl')}`;
  }),

  adjustedPaymentDate: computed('paymentDate', function() {
    const paymentDate = moment(get(this, 'paymentDate'));
    const adjustmentDay = get(this, 'paymentDateAdjustmentDay');
    const paymentDateDay = paymentDate.date();
    const difference = adjustmentDay - paymentDateDay;

    const paymentDateYear =paymentDate.year();
    const paymentDateMonth = paymentDate.month() + 1;
    let adjustedPaymentDate;

    if (difference === 0) {
      adjustedPaymentDate = paymentDate;
    } else if (difference > 0) {
      adjustedPaymentDate = moment(`${paymentDateYear}-${paymentDateMonth}-${adjustmentDay}`);
    } else {
      if (paymentDateMonth < 12) {
        adjustedPaymentDate =  moment(`${paymentDateYear}-${paymentDateMonth + 1}-${adjustmentDay}`);
      } else {
        adjustedPaymentDate =  moment(`${paymentDateYear + 1}-1-${adjustmentDay}`);
      }
    }

    return adjustedPaymentDate;
  })
});
