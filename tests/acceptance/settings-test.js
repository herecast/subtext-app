import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import { visit, find, currentURL } from '@ember/test-helpers';

module('Acceptance | settings page', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
  });


  test('Settings redirects non logged in user', async function(assert) {
    await visit('/settings');

    assert.equal(currentURL(), '/sign_in', 'Should redirect anonymous user to sign in');
  });

  test('Settings permits logged in user', async function(assert) {
    const currentUser = this.server.create('caster');
    authenticateUser(this.server, currentUser);

    await visit('/settings');

    assert.equal(currentURL(), '/settings', 'Should allow logged in user to access settings');

    assert.ok(find('[data-test-settings-tab="caster-page"].active'), 'Should show the caster page tab and default that one as active');
    assert.ok(find('[data-test-settings-tab="feed-settings"]'), 'Should show the feed settings tab as option');
    assert.ok(find('[data-test-settings-tab="account"]'), 'Should show the account tab as option');
    assert.ok(find('[data-test-settings-tab="payments"]'), 'Should show the payments tab as option');
  });


});
