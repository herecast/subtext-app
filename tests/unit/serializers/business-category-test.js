import { moduleForModel, test } from 'ember-qunit';

moduleForModel('business-category', 'Unit | Serializer | business category', {
  // Specify the other units that are required for this test.
  needs: ['serializer:business-category', 'model:business-profile', 'transform:raw']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
