import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('event-instance', {
  // Specify the other units that are required for this test.
  needs: ['model:other-event-instance']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
