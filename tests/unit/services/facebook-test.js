import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | facebook', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:facebook');
    assert.ok(service);
  });
});
