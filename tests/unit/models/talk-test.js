import { moduleForModel, test } from 'ember-qunit';

moduleForModel('talk', 'Unit | Model | talk', {
  // Specify the other units that are required for this test.
  needs: ['model:organization']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
