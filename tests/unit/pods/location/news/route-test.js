import { moduleFor, test } from 'ember-qunit';

moduleFor('route:location/news', 'Unit | Route | location/news', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
