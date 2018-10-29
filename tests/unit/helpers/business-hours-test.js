import { businessHours } from '../../../helpers/business-hours';
import { module, test } from 'qunit';

module('Unit | Helper | business hours', function() {
  // Replace this with your real tests.
  test('it worksx', function(assert) {
    let result = businessHours( [ ["Mo-Fr|08:00-16:30", "Sa|10:00-16:00"], [] ]);
    assert.ok(result);
  });
});
