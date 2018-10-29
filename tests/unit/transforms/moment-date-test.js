import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:moment-date', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var transform = this.owner.lookup('transform:moment-date');
    assert.ok(transform);
  });
});
