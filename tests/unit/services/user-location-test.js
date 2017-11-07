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

  let locationId = 'hanover-nh';

  service.saveSelectedLocationId(locationId);

  assert.ok(
    cookies.write.calledWith('locationId', locationId),
    "Sets the locationId cookie"
  );

  assert.ok(
    cookies.write.calledWith('locationConfirmed', true),
    "Sets locationConfirmed cookie to true"
  );

  assert.equal(service.get('selectedLocationId'), locationId,
    "Sets the selectedLocationId");
});
