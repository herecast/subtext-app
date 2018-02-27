import { moduleFor, test } from 'ember-qunit';

moduleFor('route:mystuff/comments', 'Unit | Route | mystuff/comments', {
  // Specify the other units that are required for this test.
   needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
