import { formattedPhone } from '../../../helpers/formatted-phone';
import { module, test } from 'qunit';

module('Unit | Helper | formatted phone', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = formattedPhone(["8025551212","0"]);
    assert.ok(result);
  });
});
