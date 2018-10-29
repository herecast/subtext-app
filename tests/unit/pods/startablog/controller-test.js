import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | startablog', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:startablog');
    assert.ok(controller);
  });
});
