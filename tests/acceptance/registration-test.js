import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, click, find, fillIn, currentURL, currentRouteName } from '@ember/test-helpers';

module('Acceptance | registration', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
  });

  test('clicking join link displays the registration form', async function(assert) {
    await visit('/');

    await click('[data-test-signin-from-header]');
    await click('[data-test-link="join-tab"]');

    assert.ok(find('[data-test-component="sign-in-submit"]'), 'registration form should be present');
  });

  test('registration works', async function(assert) {
    assert.expect(1);

    await visit('/');

    await click('[data-test-signin-from-header]');
    await click('[data-test-link="join-tab"]');

    await fillIn('[data-test-field="sign-in-email"]', 'slim_shady@example.com');
    await fillIn('[data-test-field="sign-in-password"]', 'willtherealslimshadypleasestandup1');

    await click('[data-test-component="sign-in-submit"]');

    assert.equal(currentURL(), '/sign_up/complete', 'it should be at the confirmation page after registration');
  });

  test('visiting registration page while already authenticated redirects to root page', async function(assert) {
    assert.expect(1);
    authenticateUser(this.server);

    await visit('/sign_up');

    assert.equal(currentRouteName(), 'feed.index', 'it should redirect to the correct url when the user is already authenticated');
  });
});
