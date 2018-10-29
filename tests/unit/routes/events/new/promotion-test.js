import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('route:events/new/promotion', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events/new/promotion');
    assert.ok(route);
  });
});
