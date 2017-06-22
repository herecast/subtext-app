import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:directory', 'Unit | Controller | directory', {
  needs: ['model:business-profile', 'service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
