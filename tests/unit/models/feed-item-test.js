import { moduleForModel, test } from 'ember-qunit';

moduleForModel('feed-item', 'Unit | Model | feed item', {
  // Specify the other units that are required for this test.
  needs: ['model:content', 'model:carousel', 'model:organization']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
