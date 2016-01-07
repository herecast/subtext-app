import { formError } from '../../../helpers/form-error';
import { module, test } from 'qunit';

module('Unit | Helper | form error');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = formError(['cannot be blank']);
  assert.ok(result);
});
