import { capitalizeHelper } from '../../../helpers/capitalize';
import { module, test } from 'qunit';

module('Unit | Helper | capitalize', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let myString = "my text";
    let result = capitalizeHelper([myString]);
    assert.equal(result,"My text");
  });
});
