import {
  moduleForModel,
  test
} from 'ember-qunit';


moduleForModel('current-user', 'Unit | Model | current-user', {
  needs: ['model:organization', 'model:location', 'model:bookmark']
});

test('it exists', function(assert) {
  var model = this.subject();
  
  assert.ok(!!model);
});
