import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | register/complete', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:register/complete');
    assert.ok(route);
  });
});
