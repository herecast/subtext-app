import { moduleFor, test } from 'ember-qunit';

moduleFor('route:talk/edit', 'Unit | Route | talk/edit', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
