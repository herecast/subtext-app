import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Serializer | current-user', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it serializes records', function(assert) {
    var record = run(() => this.owner.lookup('service:store').createRecord('current-user'));

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
