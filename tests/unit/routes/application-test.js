import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:application', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: [
    'service:session',
    'service:api',
    'service:user',
    'service:intercom'
  ]
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
