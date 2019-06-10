import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { visit, find, click, fillIn, currentURL } from '@ember/test-helpers';

module('Acceptance | digests', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /digests/:id/subscribe when user is not logged in and IS NOT a registered dailyuv member', async function(assert) {
    assert.expect(5);
    invalidateSession();

    const digests = this.server.createList('digest', 3);
    const digest  = digests[1];
    const location = this.server.create('location');
    this.server.create('current-user', { locationId: location.id, email: 'example@example.com'});

    await visit(`/digests/${digest.id}/subscribe`);

    assert.equal($(find('[data-test-digest-name]')).text().trim(), `${digest.name}`, 'it shows the digest title');
    assert.equal($(find('[data-test-digest-description]')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
    assert.ok(find('[data-test-field="email"]'), 'it has an input field for email');

    await fillIn('[data-test-field="email"]', 'nonmember@example.com');
    await click(find('[data-test-button="submit"]'));

    assert.notOk(find('[data-test-success]'), 'i should not see a success message');
    assert.equal(currentURL(), '/sign_up?email=nonmember%40example.com', 'when i submit the subscription form i am redirected to the registration page with my email prefilled');
  });

  test('visiting /digests/:id/subscribe when user is not logged in and IS a registered dailyuv member', async function(assert) {
    assert.expect(5);
    invalidateSession();

    const digests = this.server.createList('digest', 3);
    const digest  = digests[1];
    const location = this.server.create('location');
    const user    = this.server.create('current-user', { locationId: location.id, email: 'example@example.com'});

    await visit(`/digests/${digest.id}/subscribe`);

    const startingUrl = currentURL();

    assert.equal($(find('[data-test-digest-name]')).text().trim(), `Listserv Digest ${digest.id - 1}`, 'it shows the digest title');
    assert.equal($(find('[data-test-digest-description]')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
    assert.ok(find('[data-test-field="email"]'), 'it has an input field for email');

    await fillIn('[data-test-field="email"]', user.email);
    await click(find('[data-test-button="submit"]'));

    assert.equal(currentURL(), startingUrl, 'when i submit the subscription form i am not redirected');
    assert.ok(find('[data-test-success]'), 'i am shown a success message');
  });

  test('visiting /digests/:id/subscribe when user is logged in as a registered dailyuv member', async function(assert) {
    assert.expect(6);

    const location = this.server.create('location');

    authenticateUser(this.server, this.server.create(
      'current-user', { locationId: location.id, email: 'example@example.com' })
    );

    const digests = this.server.createList('digest', 3);
    const digest  = digests[1];

    await visit(`/digests/${digest.id}/subscribe`);

    const startingUrl = currentURL();

    assert.equal($(find('[data-test-digest-name]')).text().trim(), `Listserv Digest ${digest.id - 1}`, 'it shows the digest title');
    assert.equal($(find('[data-test-digest-description]')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
    assert.notOk(find('[data-test-field="email"]'), 'it does not have an input field for email');
    assert.ok(find('[data-test-logged-in]'), 'it indicates i am logged in');

    await click(find('[data-test-button="submit"]'));

    assert.equal(currentURL(), startingUrl, 'when i submit the subscription form i am not redirected');
    assert.ok(find('[data-test-success]'), 'i am shown a success message');
  });
});
