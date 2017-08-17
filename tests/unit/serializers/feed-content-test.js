import { moduleForModel, test } from 'ember-qunit';

moduleForModel('feed-content', 'Unit | Serializer | feed content', {
  // Specify the other units that are required for this test.
  needs: [
    'serializer:feed-content', 'model:other-event-instance', 'model:image',
    'model:organization', 'transform:moment-date', 'transform:raw'
]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
