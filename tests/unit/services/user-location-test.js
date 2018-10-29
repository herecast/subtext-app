import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';

module('Unit | Service | user location', function(hooks) {
  setupTest(hooks);

  test('saveSelectedLocationId', function(assert) {
    let cookies = {
      write: sinon.spy(),
      read() {}
    };

    let service = this.owner.factoryFor('service:user-location').create({
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
});
