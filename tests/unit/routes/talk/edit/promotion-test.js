import { moduleFor, test } from 'ember-qunit';

moduleFor('route:talk/edit/promotion', 'Unit | Route | talk/edit/promotion', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
