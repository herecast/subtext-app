import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | history', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var service = this.owner.lookup('service:history');
    assert.ok(service);
  });
});
