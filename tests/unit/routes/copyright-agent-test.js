import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | copyright agent', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var route = this.owner.lookup('route:copyright-agent');
    assert.ok(route);
  });
});
