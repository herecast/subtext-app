import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, click, find, fillIn, currentRouteName } from '@ember/test-helpers';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
      window.Intercom = function() {
    };
    mockLocationCookie(this.server);
    loadPioneerFeed(false);
  });

  test('logging in works', async function(assert) {
    let location = this.server.create('location');
    let user = this.server.create('current-user', {location_id: location.id, email: "embertest@subtext.org"});

    await visit('/');

    await click('[data-test-sidenav-from-header]');
    await click('[data-test-signin-from-side-menu]');

    await fillIn('[data-test-field="sign-in-email"]', user.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click('[data-test-component="sign-in-submit"]');

    await click('[data-test-link="user-avatar"]');

    assert.ok(find('[data-test-link="logout-link"]'), 'Should see logout link');
  });

  test('logging out works', async function(assert) {
    let user = this.server.create('current-user');
    authenticateUser(this.server, user);

    await visit('/');

    assert.notOk(find('[data-test-sidenav-from-header]'), 'it should not show the hamburger menu');

    await click('[data-test-avatar-in-header]');
    await click('[data-test-link="logout-link"]');
    await click('[data-test-logout-yes]');

    assert.ok(find('[data-test-sidenav-from-header]'), 'it should show the hamburger menu');
  });

  test('visiting log in page while already authenticated redirects to root page', async function(assert) {
    let user = this.server.create('current-user');
    authenticateUser(this.server, user);

    await visit('/sign_in');

    assert.equal(currentRouteName(), 'feed.index', 'it should be at the correct url');
  });
});
