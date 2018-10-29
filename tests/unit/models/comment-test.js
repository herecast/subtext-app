import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | comment', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var model = run(() => this.owner.lookup('service:store').createRecord('comment'));
    // var store = this.store();
    assert.ok(!!model);
  });
});
