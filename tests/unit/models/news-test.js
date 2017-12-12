import { moduleForModel, test } from 'ember-qunit';

moduleForModel('news', 'Unit | Model | news', {
  // Specify the other units that are required for this test.
  needs: ['model:organization', 'model:content-location', 'model:location']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
