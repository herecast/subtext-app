import { moduleFor, test } from 'ember-qunit';

moduleFor('route:forgot-password/index', 'Unit | Route | forgot password/index', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
