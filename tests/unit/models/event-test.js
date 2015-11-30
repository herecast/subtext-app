import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event', {
  // Specify the other units that are required for this test.
  needs: ['model:event-instance', 'model:other-event-instance', 'model:schedule']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
