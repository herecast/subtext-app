import { inArray } from '../../../helpers/in-array';
import { module, test } from 'qunit';

module('Unit | Helper | in array');

// Replace this with your real tests.
test('it works', function(assert) {
  let arry = [1,2];
  let result = inArray([1, arry]);
  assert.ok(result);

  result = inArray([3, arry]);
  assert.notOk(result);
});
