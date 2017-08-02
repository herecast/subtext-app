import { moduleForModel, test } from 'ember-qunit';

moduleForModel('market-post', 'Unit | Serializer | market-post', {
  // Specify the other units that are required for this test.
  needs: ['serializer:market-post', 'transform:raw', 'transform:moment-date',
    'model:image', 'model:organization', 'model:content-location'
  ]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
