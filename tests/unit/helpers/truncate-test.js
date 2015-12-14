import { truncate } from '../../../helpers/truncate';
import { module, test } from 'qunit';

module('Unit | Helper | truncate');

test('it works', function(assert) {
  let result = truncate('foobar', 3);

  assert.ok(result);
});
