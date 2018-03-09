import { moduleFor, test } from 'ember-qunit';

moduleFor('service:bookmarks', 'Unit | Service | bookmarks', {
  // Specify the other units that are required for this test.
   needs: [
     'service:session',
     'service:api',
     'service:user',
     'service:intercom',
     'service:fastboot',
     'service:user-location'
   ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
