import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | paid content', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:paid-content');
    assert.ok(route);
  });
});
