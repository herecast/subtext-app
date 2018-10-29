import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('route:events/edit/promotion', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events/edit/promotion');
    assert.ok(route);
  });
});
