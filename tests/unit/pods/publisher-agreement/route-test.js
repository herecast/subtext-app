import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | publisher agreement', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:publisher-agreement');
    assert.ok(route);
  });
});
