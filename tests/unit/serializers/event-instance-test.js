import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event-instance', {
  // Specify the other units that are required for this test.
  needs: ['serializer:event-instance', 'model:comment', 'transform:moment-date', 'model:other-event-instance', 'transform:raw', 'model:organization']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
