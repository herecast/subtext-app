import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import { visit, click, find, findAll, fillIn, currentURL, currentRouteName } from '@ember/test-helpers';


module('Acceptance | homepage', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
  });

  test('feed redirects to welcome route when visiting index not logged in and no location cookie present (first time user)', async function(assert) {
    this.cookies = {};
    mockCookies(this.cookies);

    await visit('/');

    assert.equal(currentRouteName(), 'welcome', 'it redirected to the welcome route');
  });

  test('feed works when visiting index not logged in and location is present in cookie (return anonymous user to live feed)', async function(assert) {
    const done = assert.async();
    const cookieLocation = mockLocationCookie(this.server);
    const feedItems = this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, cookieLocation.id, "The location id from the cookie is passed to the api request");
        done();
      }

      return feedItems.all();
    });

    await visit('/');

    assert.notOk(find('[data-test-component="pioneer-feed"]'), 'Should not show pioneer feed');

    feedItems.forEach((record) => {
      const $feedCard = find('[data-test-feed-card]' + `[data-test-content="${record.content.id}"]`);
      assert.ok($feedCard, `A feed card exists for content id: ${record.content.id}`);
    });
  });

  test('feed works when visiting index not logged in and location is present in cookie (return anonymous user to not yet live feed goes to pioneer feed)', async function(assert) {
    loadPioneerFeed(true);
    mockLocationCookie(this.server);
    this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    await visit('/');

    assert.ok(find('[data-test-component="pioneer-feed"]'), 'should show the pioneer feed');
  });

  test('feed works when visiting index and logged in with mismatched cookie location', async function(assert) {
    const done = assert.async();
    mockLocationCookie(this.server);
    const userLocation = this.server.create('location');
    const currentUser = this.server.create('current-user', {locationId: userLocation.id});

    const feedItems = this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, userLocation.id, "The logged in users location id is passed to the api request");
        done();
      }

      return feedItems.all();
    });

    authenticateUser(this.server, currentUser);

    await visit('/');

    feedItems.forEach((record) => {
      const $feedCard = find('[data-test-feed-card]' + `[data-test-content="${record.content.id}"]`);
      assert.ok($feedCard, `A feed card exists for content id: ${record.content.id}`);
    });
  });

  test('visiting / - has been before, not logged in user menu, log in and check user menu, then logout', async function(assert) {
    mockLocationCookie(this.server);

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

    await click('[data-test-component="sign-in-submit"]');

    await click('[data-test-avatar-in-header]');

    assert.ok(find('[data-test-mystuff-navbar]'), 'Side menu should show mystuff options when logged in');
    assert.equal(findAll('[data-test-managed-organization-button]').length, 2, 'Side menu should show the managed organization buttons');

    await click('[data-test-link="logout-link"]');

    await click('[data-test-logout-yes]');

    assert.equal(currentURL(), '/', "Home page displays again");
    assert.notOk(find('[data-test-avatar-in-header]'), 'Avatar should not show in header after signout');
  });
});
