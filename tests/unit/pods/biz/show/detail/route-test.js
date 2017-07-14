import { moduleFor, test } from 'ember-qunit';

moduleFor('route:biz/show/detail', 'Unit | Route | biz/show/detail', {
  needs: ['service:history']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
