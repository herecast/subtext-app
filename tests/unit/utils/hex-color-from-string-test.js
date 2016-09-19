import hexColorFromString from 'subtext-ui/utils/hex-color-from-string';
import { module, test } from 'qunit';

module('Unit | Utility | hex color from string');

test('converting string to hex colour', function(assert) {
  assert.equal(hexColorFromString('John Smith'), '#AE5CAE', 'it converts a string to a hex value');
  assert.equal(hexColorFromString('John Smith'), '#AE5CAE', 'it is idempotent');
});
