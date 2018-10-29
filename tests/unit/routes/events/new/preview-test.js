import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | events/new/preview', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events/new/preview');
    assert.ok(route);
  });
});
