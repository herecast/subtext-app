import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | error 404', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:error-404');
    assert.ok(route);
  });
});
