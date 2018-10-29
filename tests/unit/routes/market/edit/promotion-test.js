import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | market/edit/promotion', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:market/edit/promotion');
    assert.ok(route);
  });
});
