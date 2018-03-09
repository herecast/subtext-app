import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';

moduleForAcceptance('Acceptance | homepage', {
  beforeEach() {
    this.cookies = {};
    mockCookies(this.application, this.cookies);
  }
});

test('visiting /, not located', function(assert) {
  server.createList('location', 3);

  visit('/');

  andThen(function() {
    assert.equal(
      currentURL(), '/feed?location=sharon-vt',
      "It redirects to the feed with the default hartford selected"
    );
  });
});

test('Location in cookie; not confirmed; visit /', function(assert) {
  const location = server.create('location');

  this.cookies['locationId'] = location.id;
  this.cookies['locationConfirmed'] = null;

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=sharon-vt`,
      "Redirects to feed index with default location. (location not confirmed)");
  });
});

test('Location in cookie; confirmed; visit /', function(assert) {
  const location = server.create('location');

  this.cookies['locationId'] = location.id;
  this.cookies['locationConfirmed'] = true;

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
      "Redirects to feed index with cookie location id");
  });
});

test('Location in cookie; confirmed; signed in; user location not confirmed; visit /', function(assert) {
  const done = assert.async();
  const location = server.create('location');

  this.cookies['locationId'] = location.id;
  this.cookies['locationConfirmed'] = true;

  authenticateUser(this.application,
    server.create('current-user', {
      locationConfirmed: false
    })
  );

  server.put('/current_user', function(db, request) {
    const data = JSON.parse(request.requestBody);
    assert.equal(data['current_user']['location_confirmed'], true,
      "The user's location_confirmed value is updated to match the cookie");
    done();
    return data;
  });

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
      "Redirects to feed index with cookie location id");

  });
});

test('Location in cookie; confirmed cookie; signed in ; user location confirmed; visit /', function(assert) {
  const location = server.create('location');

  this.cookies['locationId'] = location.id;
  this.cookies['locationConfirmed'] = true;

  authenticateUser(this.application,
    server.create('current-user', {
      locationConfirmed: true,
      locationId: location.id
    })
  );

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
    "Redirects to feed index with cookie location id");
  });
});

test('No location cookie; no confirmed cookie; signed in; user location; user location not confirmed; visit /', function(assert) {

  const location = server.create('location');

  authenticateUser(this.application,
    server.create('current-user', {
      locationConfirmed: false,
      locationId: location.id
    })
  );

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
    "Redirects to feed index with user default location");

    assert.equal(this.cookies['locationId'], location.id,
      "The location cookie is written based on user locationId");
  });
});

test('No location cookie; no confirmed cookie; signed in; user location; user location confirmed; visit /', function(assert) {

  const location = server.create('location');

  authenticateUser(this.application,
    server.create('current-user', {
      locationConfirmed: true,
      locationId: location.id
    })
  );

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
    "Redirects to feed index with user location id");

    assert.equal(this.cookies['locationId'], location.id,
      "The location cookie is written based on user locationId");

    assert.equal(this.cookies['locationConfirmed'], true,
      "The location confirmed cookie is written based on user location confirmed");
  });
});
