import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:mystuff/bookmarks', 'Unit | Controller | mystuff/bookmarks', {
  // Specify the other units that are required for this test.
   needs: [
    'service:history',
   'service:bookmarks',
   'service:session',
   'service:fastboot',
   'service:user-location',
   'service:intercom',
   'service:api',
   'service:user'
 ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
