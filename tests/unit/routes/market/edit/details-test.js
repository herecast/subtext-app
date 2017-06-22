import { moduleFor, test } from 'ember-qunit';

moduleFor('route:market/edit/details', 'Unit | Route | market/edit/details', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
