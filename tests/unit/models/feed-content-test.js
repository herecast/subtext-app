import { moduleForModel, test } from 'ember-qunit';

moduleForModel('feed-content', 'Unit | Model | feed content', {
  // Specify the other units that are required for this test.
  needs: ['model:comment', 'model:other-event-instance', 'model:image',
  'model:organization', 'model:content-location', 'model:carousel']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
