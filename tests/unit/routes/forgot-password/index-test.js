import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | forgot password/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:forgot-password/index');
    assert.ok(route);
  });
});
