import { moduleFor, test } from 'ember-qunit';

moduleFor('route:biz', 'Unit | Route | biz', {
  needs: ['model:organization-content', 'service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
