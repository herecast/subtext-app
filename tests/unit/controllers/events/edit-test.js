import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:events/edit', 'Unit | Controller | events/edit', {
  // Specify the other units that are required for this test.
   needs: ['service:history']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
