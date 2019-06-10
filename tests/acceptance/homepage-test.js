import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import mockService from 'subtext-app/tests/helpers/mock-service';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import { visit, click, find, findAll, fillIn, currentURL } from '@ember/test-helpers';

module('Acceptance | homepage', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cookies = {};
    mockCookies(this.cookies);
    invalidateSession();
  });

  test('visiting / - no location cookie, not logged in', async function(assert) {
    const done = assert.async(2);
    const defaultLocationId = 19; //Hartford VT

    this.server.create('location', {id: defaultLocationId});

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, defaultLocationId, "The default location id is passed to the api request");
        done();
      }

      return {feedItems: []};
    });

    await visit('/');

    assert.equal(currentURL(), '/', "Home page displays");
    await click('[data-test-signin-from-header]');

    let location = this.server.create('location');
    let user = this.server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

    this.server.get('/feed', function(db, request) {

      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, location.id, "The logged in user location id is passed to the api request");
        done();
      }

      return {feedItems: []};
    });

    await fillIn('[data-test-field="sign-in-email"]', user.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click('[data-test-component="sign-in-submit"]');
  });

  test('visiting / - with location cookie, not logged in', async function(assert) {
    const done = assert.async(2);
    const cookieLocation = mockLocationCookie(this.server);

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, cookieLocation.id, "The cookie location id is passed to the api request");
        done();
      }

      return {feedItems: []};
    });

    await visit('/');

    assert.equal(currentURL(), '/', "Home page displays");
    await click('[data-test-signin-from-header]');

    let location = this.server.create('location');
    let user = this.server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, location.id, "The logged in user location id is passed to the api request");
        done();
      }

      return {feedItems: []};
    });

    await fillIn('[data-test-field="sign-in-email"]', user.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click('[data-test-component="sign-in-submit"]');
  });

  test('visiting / - with location cookie, logged in, user location matches cookie location', async function(assert) {
    const done = assert.async();

    let location = this.server.create('location');
    let user = this.server.create('current-user', {locationId: location.id, email: "embertest@subtext.org"});

    mockLocationCookie(this.server, location);
    authenticateUser(this.server, user);

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, location.id, "The user's location id is passed to the api request");
        done();
      }

      return {feedItems: []};
    });

    await visit('/');

    assert.equal(currentURL(), '/', "Home page displays");
  });

  test('visiting / - with location cookie, logged in, user location doesnt match cookie location', async function(assert) {
    const done = assert.async();

    let userLocation = this.server.create('location');

    let user = this.server.create('current-user', {locationId: userLocation.id, email: "embertest@subtext.org"});

    mockService('cookies',{
      read: () => {},
      write: (name, value) => {
        if (name === 'userLocationId') {
          assert.equal(value, userLocation.id, 'The cookie is set to the user location');
        }
      }
    });

    authenticateUser(this.server, user);

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, userLocation.id, "The user's location id is passed to the api request, not the cookie location id");
        done();
      }

      return {feedItems: []};
    });

    await visit('/');

    assert.equal(currentURL(), '/', "Home page displays");
  });

  test('visiting / - not logged in user menu, log in and check user menu, then logout', async function(assert) {
    const done = assert.async();
    this.server.create('location', {id: 19}); //Default location

    await visit('/');

    assert.equal(currentURL(), '/', "Home page displays");
    await click('[data-test-sidenav-from-header]');

    let $sideMenu = $(find('[data-test-side-menu]'));
    assert.ok($sideMenu.hasClass('on-screen'), 'Side Menu should be on screen after click signin prompt in header');

    await click('[data-test-signin-from-side-menu]');

    assert.ok($sideMenu.hasClass('off-screen'), 'Side Menu should close after signin prompt clicked from side menu');
    assert.ok(find('[data-test-component="sign-in"]'), 'Sign in modal should show after signin prompt clicked from side menu');

    let userLocation = this.server.create('location');
    let organizations = this.server.createList('organization', 2);
    let user = this.server.create('current-user', {
      locationId: userLocation.id,
      email: "embertest@subtext.org",
      managedOrganizationIds: organizations.map(org => org.id)
    });

    await fillIn('[data-test-field="sign-in-email"]', user.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    this.server.get('/feed',() => {
      done();
      return {feedItems: []};
    });

    await click('[data-test-component="sign-in-submit"]');

    await click('[data-test-avatar-in-header]');

    assert.ok(find('[data-test-mystuff-navbar]'), 'Side menu should show mystuff options when logged in');
    assert.equal(findAll('[data-test-managed-organization-button]').length, 2, 'Side menu should show the managed organization buttons');

    await click('[data-test-link="logout-link"]');

    await click('[data-test-logout-yes]');

    assert.equal(currentURL(), '/', "Home page displays again");
    assert.ok(find('[data-test-signin-from-header]'), 'Signin prompt should show in header after logout');
  });
});
