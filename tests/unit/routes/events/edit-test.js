import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('route:events/edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events/edit');
    assert.ok(route);
  });
});
