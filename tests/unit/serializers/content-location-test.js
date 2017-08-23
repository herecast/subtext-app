import { moduleForModel, test } from 'ember-qunit';

moduleForModel('content-location', 'Unit | Serializer | content location', {
  // Specify the other units that are required for this test.
  needs: ['serializer:content-location', 'model:location']
});

// Replace this with your real tests.
test('it removes the location_name key', function(assert) {
  let record = this.subject({locationName: 'foo'});

  let serializedRecord = record.serialize();

  assert.equal(serializedRecord.location_name, undefined);
});
