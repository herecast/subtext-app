import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | promotions/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:promotions/show');
    assert.ok(route);
  });
});
