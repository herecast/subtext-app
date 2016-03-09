import { moduleForModel, test } from 'ember-qunit';

moduleForModel('business-profile', 'Unit | Serializer | business profile', {
  // Specify the other units that are required for this test.
  needs: ['serializer:business-profile', 'model:business-category', 'transform:raw']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
