import { moduleForModel, test } from 'ember-qunit';
import moment from 'moment';

moduleForModel('content-payment', 'Unit | Model | content payment', {
  // Specify the other units that are required for this test.
  needs: []
});

test('Properly adjusts payment dates - before adjustment day mid year', function(assert) {
  const dateFormat = 'YYYY-MM-DD';
  const paymentDateAdjustmentDay = 10;

  let payment = this.subject({
    paymentDate: moment(`2018-06-${paymentDateAdjustmentDay - 1}`),
    paymentDateAdjustmentDay
  });

  let adjustedPaymentDate = payment.get('adjustedPaymentDate').toDate();
  let expected = moment(`2018-06-${paymentDateAdjustmentDay}`, `${dateFormat}`).toDate();

  assert.deepEqual(adjustedPaymentDate, expected);
});

test('Properly adjusts payment dates - after adjustment day mid year', function(assert) {
  const dateFormat = 'YYYY-MM-DD';
  const paymentDateAdjustmentDay = 10;

  let payment = this.subject({
    paymentDate: moment(`2018-06-${paymentDateAdjustmentDay + 1}`),
    paymentDateAdjustmentDay
  });

  let adjustedPaymentDate = payment.get('adjustedPaymentDate').toDate();
  let expected = moment(`2018-07-${paymentDateAdjustmentDay}`, `${dateFormat}`).toDate();

  assert.deepEqual(adjustedPaymentDate, expected);
});

test('Properly adjusts payment dates - after adjustment day end of year', function(assert) {
  const dateFormat = 'YYYY-MM-DD';
  const paymentDateAdjustmentDay = 10;

  let payment = this.subject({
    paymentDate: moment(`2018-12-${paymentDateAdjustmentDay + 1}`),
    paymentDateAdjustmentDay
  });

  let adjustedPaymentDate = payment.get('adjustedPaymentDate').toDate();
  let expected = moment(`2019-01-${paymentDateAdjustmentDay}`, `${dateFormat}`).toDate();

  assert.deepEqual(adjustedPaymentDate, expected);
});
