import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | market/edit/preview', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:market/edit/preview');
    assert.ok(route);
  });
});
