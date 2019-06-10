import computedInitials from 'subtext-app/utils/computed-initials';
import { module, test } from 'qunit';

module('Unit | Utility | computed initials', function() {
  test('it computes initials from an arbitrary string', function(assert) {
    assert.equal(computedInitials('J'), 'J', 'result should be "J" when input is "John"');
    assert.equal(computedInitials('John Smith'), 'JS', 'result should be "JS" when input is "John Smith"');
    assert.equal(computedInitials('John Gary Smith'), 'JS', 'result should be "JS" when input is "John Gary Smith"');
  });

  test('it removes stop words from arbitrary string', function(assert) {
    assert.equal(computedInitials('The Wandering Forest'), 'WF', 'result should be "WF" when input is "The Wandering Forest"');
    assert.equal(computedInitials('A Night To Remember'), 'NR', 'result should be "NR" when input is "A Night To Remember"');
  });
});
