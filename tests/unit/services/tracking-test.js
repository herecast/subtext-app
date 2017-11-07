import {moduleFor, test} from 'ember-qunit';

moduleFor('service:tracking', 'Unit | Service | tracking', {
  // Specify the other units that are required for this test.
  needs: ['service:user-location', 'service:cookies', 'service:geolocation', 'service:session',
    'service:api', 'service:window-location', 'service:history', 'service:fastboot', 'service:user',
    'service:intercom'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
