import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:application', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
  needs: [
    'service:session',
    'service:cookies',
    'service:api',
    'service:user',
    'service:fastboot',
    'service:intercom',
    'service:user-location',
    'service:history'
  ]
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
