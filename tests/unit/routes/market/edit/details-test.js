import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | market/edit/details', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:market/edit/details');
    assert.ok(route);
  });
});
