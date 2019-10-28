import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | caster-follow', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:caster-follow');
    assert.ok(service);
  });
});
