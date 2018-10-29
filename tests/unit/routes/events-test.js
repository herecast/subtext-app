import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('route:events', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events');
    assert.ok(route);
  });
});
