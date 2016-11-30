import { moduleForModel, test } from 'ember-qunit';

moduleForModel('market-category', 'Unit | Model | market category', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
