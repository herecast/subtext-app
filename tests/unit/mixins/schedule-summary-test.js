import Ember from 'ember';
import ScheduleSummaryMixin from '../../../mixins/schedule-summary';
import { module, test } from 'qunit';

module('Unit | Mixin | schedule summary');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScheduleSummaryObject = Ember.Object.extend(ScheduleSummaryMixin);
  let subject = ScheduleSummaryObject.create();
  assert.ok(subject);
});
