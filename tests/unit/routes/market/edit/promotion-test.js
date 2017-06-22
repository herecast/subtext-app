import { moduleFor, test } from 'ember-qunit';

moduleFor('route:market/edit/promotion', 'Unit | Route | market/edit/promotion', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
