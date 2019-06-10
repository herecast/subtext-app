import { computed, get } from '@ember/object';
import config from 'subtext-app/config/environment';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  periodStart: DS.attr('string'),
  periodEnd: DS.attr('string'),
  paidImpressions: DS.attr('number'),
  views: DS.attr('number'),
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

    const paymentDateYear = paymentDate.year();
    const paymentDateMonth = paymentDate.month() + 1;
    let adjustedPaymentDate;

    if (difference === 0) {
      adjustedPaymentDate = paymentDate;
    } else if (difference > 0) {
      adjustedPaymentDate = moment(`${paymentDateYear}-${paymentDateMonth}-${adjustmentDay}`, 'YYYY-MM-DD');
    } else {
      if (paymentDateMonth < 12) {
        adjustedPaymentDate =  moment(`${paymentDateYear}-${paymentDateMonth + 1}-${adjustmentDay}`, 'YYYY-MM-DD');
      } else {
        adjustedPaymentDate =  moment(`${paymentDateYear + 1}-01-${adjustmentDay}`, 'YYYY-MM-DD');
      }
    }

    return adjustedPaymentDate;
  })
});
