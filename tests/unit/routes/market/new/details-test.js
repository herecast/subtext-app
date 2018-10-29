import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | market/new/details', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:market/new/details');
    assert.ok(route);
  });
});
