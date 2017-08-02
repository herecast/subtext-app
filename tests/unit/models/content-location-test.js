import { moduleForModel, test } from 'ember-qunit';

moduleForModel('content-location', 'Unit | Model | content location', {
  // Specify the other units that are required for this test.
  needs: ['model:location']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
