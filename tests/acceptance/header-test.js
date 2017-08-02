import { skip } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import CookiesService from 'subtext-ui/services/cookies';
import mockService from 'subtext-ui/tests/helpers/mock-service';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | header');

skip('My location is displayed in header', function(assert) {
  const location = server.create('location');
  const locationName = [location.city, location.state].join(', ');

  visit(`/${location.id}`);

  andThen(()=>{
    const $indicator = find(testSelector('location-indicator'));
    assert.equal(
      $indicator.eq(0).text().trim(),
      locationName
    );
  });
});

skip('Changing my location, from header', function(assert) {
  const myLocation = server.create('location');
  const newLocation = server.create('location');
  let cookieValue = null;

  const cookies = CookiesService.extend({
    write(name, value) {
      if(name === 'locationId') {
        return cookieValue = value;
      } else {
        return this._super(...arguments);
      }
    }
  });

  mockService(this.application, 'cookies', cookies);

  const user = authenticateUser(this.application, server);
  server.put('/current_user', function({currentUsers}) {
    const currentUser = currentUsers.first();
    user.locationId = newLocation.id;
    currentUser.locationId = newLocation.id;
    return currentUser;
  });


  visit(`/${myLocation.id}`);

  andThen(()=>{
    const $indicator = find(testSelector('location-indicator'));

    click($indicator.eq(0));
  });

  andThen(()=>{
    click(
      '[data-test-click-target]',
      `[data-test-link=choose-location][data-test-location=${newLocation.id}]`
    );
  });

  andThen(()=>{
    const locationName = [newLocation.city, newLocation.state].join(', ');

    assert.equal(
      currentURL(),
      `/${newLocation.id}`,
      "Clicking a new location changes my url to new location version"
    );

    const $indicator = find(testSelector('location-indicator'));
    assert.equal(
      $indicator.eq(0).text().trim(),
      locationName,
      "The new location is reflected in the location-indicator"
    );

    assert.equal(
      cookieValue,
      newLocation.id,
      "Changing location, sets cookie"
    );

    assert.equal(
      user.locationId,
      newLocation.id,
      "Changing location saves to currentUser"
    );
  });
});
