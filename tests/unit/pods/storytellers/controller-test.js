import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:storytellers', 'Unit | Controller | storytellers', {
  // Specify the other units that are required for this test.
  needs: ['service:history']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
