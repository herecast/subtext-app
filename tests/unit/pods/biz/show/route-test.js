import { moduleFor, test } from 'ember-qunit';

moduleFor('route:biz/show', 'Unit | Route | biz/show', {
  needs: ['model:organization-content', 'service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
