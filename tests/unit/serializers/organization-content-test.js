import { moduleForModel, test } from 'ember-qunit';

moduleForModel('organization-content', 'Unit | Serializer | organization content', {
  // Specify the other units that are required for this test.
  needs: ['serializer:organization-content', 'model:business-profile', 'model:organization', 'transform:moment-date']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
