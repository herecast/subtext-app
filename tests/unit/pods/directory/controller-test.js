import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | directory', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('controller:directory');
    assert.ok(route);
  });
});
