import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | caster-hide', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:caster-hide');
    assert.ok(service);
  });
});
