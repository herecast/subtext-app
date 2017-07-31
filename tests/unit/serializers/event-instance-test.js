import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event-instance', {
  // Specify the other units that are required for this test.
  needs: ['serializer:event-instance', 'transform:moment-date', 'model:other-event-instance', 'model:organization']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
