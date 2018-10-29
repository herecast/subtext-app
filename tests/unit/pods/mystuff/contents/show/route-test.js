import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | mystuff/contents/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:mystuff/contents/show');
    assert.ok(route);
  });
});
