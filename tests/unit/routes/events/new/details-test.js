import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | events/new/details', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:events/new/details');
    assert.ok(route);
  });
});
