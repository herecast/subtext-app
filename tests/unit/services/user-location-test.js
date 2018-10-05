/* global sinon */
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:user-location', 'Unit | Service | user location', {
  // Specify the other units that are required for this test.
  needs: ['service:session', 'service:user', 'service:api', 'service:intercom', 'service:fastboot']
});

test('saveSelectedLocationId', function(assert) {
  let cookies = {
    write: sinon.spy(),
    read() {}
  };

  let service = this.subject({
    cookies: cookies,
    windowLocation: {
      protocol() { return 'http'; }
    }
  });

  let locationId = 1;

  service.saveUserLocationFromId(locationId);

  assert.ok(
    cookies.write.calledWith('userLocationId', locationId),
    "Sets the locationId cookie"
  );



});
