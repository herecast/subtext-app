import { moduleForModel, test } from 'ember-qunit';

moduleForModel('news', 'Unit | Serializer | news', {
  // Specify the other units that are required for this test.
  needs: ['serializer:news']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
