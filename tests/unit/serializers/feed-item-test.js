import { moduleForModel, test } from 'ember-qunit';

moduleForModel('feed-item', 'Unit | Serializer | feed item', {
  // Specify the other units that are required for this test.
  needs: ['serializer:feed-item', 'model:carousel', 'model:feed-content', 'model:organization']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
