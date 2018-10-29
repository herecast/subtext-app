import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('CurrentUserAdapter', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var adapter = this.owner.lookup('adapter:current-user');
    assert.ok(adapter);
  });
});
