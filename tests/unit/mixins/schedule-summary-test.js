import EmberObject from '@ember/object';
import ScheduleSummaryMixin from '../../../mixins/schedule-summary';
import { module, test } from 'qunit';

module('Unit | Mixin | schedule summary', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let ScheduleSummaryObject = EmberObject.extend(ScheduleSummaryMixin);
    let subject = ScheduleSummaryObject.create();
    assert.ok(subject);
  });
});
