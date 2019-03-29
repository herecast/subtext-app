import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, click, find, fillIn, currentRouteName } from '@ember/test-helpers';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
      window.Intercom = function() {
    };
  });

  test('Follow sign in link, authentication succeeds', async function(assert) {
    const done = assert.async();
    const user = this.server.create('current-user');
    const token = "sakj342qk223dk";

    this.server.post('/users/sign_in_with_token', function({currentUsers}, request) {
      const data = JSON.parse(request.requestBody);

      assert.equal(data.token, token, "Posts token to correct server endpoint");

      currentUsers.create(user.attrs);
      done();
      return {
        email: user.email,
        token
      };
    });

    await visit('/sign_in?auth_token=' + token);

    assert.equal(currentRouteName(),'feed.index', "Should be on feed home page");

    assert.ok(find('[data-test-link="user-avatar"]'), "I should see my user menu (I am signed in)");
  });

  test('Follow sign in link, authentication fails', async function(assert) {
    const token = "sakj342qk223dk";

    this.server.post('/users/sign_in_with_token', {error: 'Token expired'}, 422);

    await visit('/sign_in?auth_token=' + token);

    assert.ok(find('[data-test-component="sign-in"]'), "I should see sign in");
  });

  test('logging in works', async function(assert) {
    let location = this.server.create('location');
    let user = this.server.create('current-user', {location_id: location.id, email: "embertest@subtext.org"});

    await visit('/');

    await click('[data-test-signin-from-header]');

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

    assert.notOk(find('[data-test-signin-from-header]'), 'it should not show the sign in link');

    await click('[data-test-link="user-avatar"]');
    await click('[data-test-link="logout-link"]');
    await click('[data-test-logout-yes]');

    assert.ok(find('[data-test-signin-from-header]'), 'it should show the sign in link');
  });

  test('visiting log in page while already authenticated redirects to root page', async function(assert) {
    let user = this.server.create('current-user');
    authenticateUser(this.server, user);

    await visit('/sign_in');

    assert.equal(currentRouteName(), 'feed.index', 'it should be at the correct url');
  });

  test('clicking sign in link displays login form', async function(assert) {
    await visit('/');

    await click('[data-test-signin-from-header]');

    assert.ok(find('[data-test-component="sign-in"]'), "Displays sign in");
  });

  test('clicking help link in header, then click sign in side menu displays login form', async function(assert) {
    await visit('/');

    await click('[data-test-sidenav-from-header]');
    await click('[data-test-signin-from-side-menu]');

    assert.ok(find('[data-test-component="sign-in"]'), "Displays sign in");
  });
});
