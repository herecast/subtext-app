import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:talk/edit', 'Unit | Controller | talk/edit', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
