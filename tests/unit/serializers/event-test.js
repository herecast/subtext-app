import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event', {
  // Specify the other units that are required for this test.
  needs: ['serializer:event', 'transform:moment-date', 'transform:raw', 'model:event-instance',
    'model:other-event-instance', 'model:schedule', 'model:organization', 'model:content-location'
  ]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
