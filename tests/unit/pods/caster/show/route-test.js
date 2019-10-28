import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | caster/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:caster/show');
    assert.ok(route);
  });
});
