import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('service:user', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var service = this.owner.lookup('service:user');
    assert.ok(service);
  });
});
