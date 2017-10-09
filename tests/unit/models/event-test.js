import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event', 'Unit | Model | event', {
  // Specify the other units that are required for this test.
  needs: ['model:event-instance', 'model:content-location', 'model:other-event-instance', 'model:schedule', 'model:organization', 'model:comment']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
