import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | mystuff/bookmarks/show instance', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:mystuff/bookmarks/show-instance');
    assert.ok(route);
  });
});
