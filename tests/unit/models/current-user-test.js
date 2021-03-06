import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';


import { run } from '@ember/runloop';

module('Unit | Model | current-user', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    var model = run(() => this.owner.lookup('service:store').createRecord('current-user'));
    
    assert.ok(!!model);
  });
});
