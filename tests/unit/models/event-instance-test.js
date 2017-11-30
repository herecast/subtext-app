import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event-instance', 'Unit | Model | event instance', {
  // Specify the other units that are required for this test.
  needs: ['model:other-event-instance', 'model:organization', 'model:comment', 'model:content-location']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
