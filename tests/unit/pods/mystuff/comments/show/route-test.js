import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | mystuff/comments/show', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:mystuff/comments/show');
    assert.ok(route);
  });
});
