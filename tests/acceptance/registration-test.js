import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, click, find, fillIn, currentURL, currentRouteName, triggerKeyEvent } from '@ember/test-helpers';

module('Acceptance | registration', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    mockLocationCookie(this.server);
    loadPioneerFeed(false);
  });

  test('clicking join link displays the registration form', async function(assert) {
    await visit('/');

    await click('[data-test-sidenav-from-header]');
    await click('[data-test-signin-from-side-menu]');

    await click('[data-test-link="join-tab"]');

    assert.ok(find('[data-test-sign-in-or-register-with-password-tab="register"]'), 'registration form should be present');
  });

  test('registration works', async function(assert) {
    const done = assert.async(2);

    await visit('/');

    await click('[data-test-sidenav-from-header]');
    await click('[data-test-signin-from-side-menu]');

    await click('[data-test-link="join-tab"]');

    this.server.get('/casters/handles/validation', () => {
      done();
      return {};
    }, 404);

    await fillIn('[data-test-field="caster-input-handle"]', 'hectorreflector');
    await triggerKeyEvent('[data-test-field="caster-input-handle"]', 'keyup', 13);

    this.server.get('/casters/emails/validation', () => {
      done();
      return {};
    }, 404);

    await fillIn('[data-test-field="caster-input-email"]', 'hector1234@example.com');
    await triggerKeyEvent('[data-test-field="caster-input-email"]', 'keyup', 13);

    await fillIn('[data-test-field="register-password"]', 'asdfasdf1234');
    await fillIn('[data-test-field="register-password-confirmation"]', 'asdfasdf1234');

    await click('[data-test-component="register-submit"]');

    assert.equal(currentURL(), '/settings', 'it should send new user to settings for onboarding');
    assert.ok(find('[data-test-component="caster-intro-modal"]'), 'should show intro modal to new user');
  });

  test('visiting registration page while already authenticated redirects to root page', async function(assert) {
    assert.expect(1);
    authenticateUser(this.server);

    await visit('/sign_up');

    assert.equal(currentRouteName(), 'feed.index', 'it should redirect to the correct url when the user is already authenticated');
  });
});
