import computedInitials from 'subtext-ui/utils/computed-initials';
import { module, test } from 'qunit';

module('Unit | Utility | computed initials');

test('it computes initials from an arbitrary string', function(assert) {
  assert.equal(computedInitials('J'), 'J', 'result should be "J" when input is "John"');
  assert.equal(computedInitials('John Smith'), 'JS', 'result should be "JS" when input is "John Smith"');
  assert.equal(computedInitials('John Gary Smith'), 'JS', 'result should be "JS" when input is "John Gary Smith"');
});
