import { test } from 'qunit';
import testSelector from 'ember-test-selectors';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';
import mockService from 'subtext-ui/tests/helpers/mock-service';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import Ember from 'ember';

moduleForAcceptance('Acceptance | homepage', {
  beforeEach() {
    this.cookies = {};
    mockCookies(this.application, this.cookies);
    invalidateSession(this.application);
  }
});

test('visiting / - no location cookie, not logged in', function(assert) {
  const done = assert.async(2);
  const defaultLocationId = 19; //Hartford VT

  server.create('location', {id: defaultLocationId});

  server.get('/feed', function(db, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, defaultLocationId, "The default location id is passed to the api request");
      done();
    }

    return {feedItems: []};
  });

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', "Home page displays");
    click(testSelector('signin-from-header'));

    andThen(() => {

      click(testSelector('signin-from-side-menu'));

      andThen(() => {
        let location = server.create('location');
        let user = server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

        server.get('/feed', function(db, request) {
          if (request.queryParams.location_id) {
            assert.equal(request.queryParams.location_id, location.id, "The logged in user location id is passed to the api request");
            done();
          }

          return {feedItems: []};
        });

        fillIn(testSelector('field', 'sign-in-email'), user.email);
        fillIn(testSelector('field', 'sign-in-password'), 'password');

        click(testSelector('component', 'sign-in-submit'));
      });
    });
  });
});

test('visiting / - with location cookie, not logged in', function(assert) {
  const done = assert.async(2);
  const cookieLocation = mockLocationCookie(this.application);

  server.get('/feed', function(db, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, cookieLocation.id, "The cookie location id is passed to the api request");
      done();
    }

    return {feedItems: []};
  });

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', "Home page displays");
    click(testSelector('signin-from-header'));

    andThen(() => {
      click(testSelector('signin-from-side-menu'));

      andThen(() => {
        let location = server.create('location');
        let user = server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

        server.get('/feed', function(db, request) {
          if (request.queryParams.location_id) {
            assert.equal(request.queryParams.location_id, location.id, "The logged in user location id is passed to the api request");
            done();
          }

          return {feedItems: []};
        });

        fillIn(testSelector('field', 'sign-in-email'), user.email);
        fillIn(testSelector('field', 'sign-in-password'), 'password');

        click(testSelector('component', 'sign-in-submit'));
      });
    });
  });
});

test('visiting / - with location cookie, logged in, user location matches cookie location', function(assert) {
  const done = assert.async();

  let location = server.create('location');
  let user = server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

  mockLocationCookie(this.application, location);
  authenticateUser(this.application, user);

  server.get('/feed', function(db, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, location.id, "The user's location id is passed to the api request");
      done();
    }

    return {feedItems: []};
  });

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', "Home page displays");
  });
});

test('visiting / - with location cookie, logged in, user location doesnt match cookie location', function(assert) {
  const done = assert.async();

  let userLocation = server.create('location');

  let user = server.create('current-user', {locationId: userLocation.id, email: "embertest@subtext.org"});

  mockService(this.application, 'cookies', Ember.Object.extend({
    read() {},
    write(name, value){
      if (name === 'userLocationId') {
        assert.equal(value, userLocation.id, 'The cookie is set to the user location');
      }
    }
  }));

  authenticateUser(this.application, user);

  server.get('/feed', function(db, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, userLocation.id, "The user's location id is passed to the api request, not the cookie location id");
      done();
    }

    return {feedItems: []};
  });

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', "Home page displays");
  });
});

test('visiting / - not logged in user menu, log in and check user menu, then logout', function(assert) {
  const done = assert.async();
  server.create('location', {id: 19}); //Default location

  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/', "Home page displays");
    click(testSelector('signin-from-header'));

    andThen(() => {
      let $sideMenu = find(testSelector('side-menu'));
      assert.ok($sideMenu.hasClass('on-screen'), 'Side Menu should be on screen after click signin prompt in header');

      click(testSelector('signin-from-side-menu'));

      andThen(() => {
        assert.ok($sideMenu.hasClass('off-screen'), 'Side Menu should close after signin prompt clicked from side menu');
        assert.ok(find(testSelector('component', 'sign-in')).length, 'Sign in modal should show after signin prompt clicked from side menu');

        let userLocation = server.create('location');
        let organizations = server.createList('organization', 2);
        let user = server.create('current-user', {
          locationId: userLocation.id,
          email: "embertest@subtext.org",
          managedOrganizationIds: organizations.map(org => org.id)
        });

        fillIn(testSelector('field', 'sign-in-email'), user.email);
        fillIn(testSelector('field', 'sign-in-password'), 'password');

        server.get('/feed',() => {
          done();
          return {feedItems: []};
        });

        click(testSelector('component', 'sign-in-submit'));

        andThen(() => {
          click(testSelector('avatar-in-header'));

          assert.ok(find(testSelector('mystuff-navbar')).length, 'Side menu should show mystuff options when logged in');
          assert.equal(find(testSelector('managed-organization-button')).length, 2, 'Side menu should show the managed organization buttons');

          click(testSelector('link', 'logout-link'));

          andThen(() => {
            click(testSelector('logout-yes'));

            andThen(() => {
              assert.equal(currentURL(), '/', "Home page displays again");
              assert.ok(find(testSelector('signin-from-header')), 'Signin prompt should show in header after logout');
            });
          });
        });
      });
    });
  });
});
