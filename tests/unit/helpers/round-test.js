import { round } from '../../../helpers/round';
import { module, test } from 'qunit';

module('Unit | Helper | round');

test('rounds number to given decimal places', function(assert) {
  let num = 42.902;
  let places = 1;
  let result = round([num, places]);
  assert.equal(result, 42.9);
});

test('rounds number to integer, when no places argument given', function(assert) {
  let num = 42.902;
  let result = round([num]);
  assert.equal(result, 43);
});
