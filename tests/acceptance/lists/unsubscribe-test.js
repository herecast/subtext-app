import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { visit, click, find, fillIn } from '@ember/test-helpers';

module('Acceptance | lists/unsubscribe', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting unsubscribe url with digest id', async function(assert) {
    assert.expect(3);
    const done = assert.async();
    const digest = this.server.create('digest');
    const email = 'test@fake.co';

    this.server.delete('/subscriptions/:id/:token', (db, request) => {
      const requestUrlParts = request.url.split('/');
      const encodedEmail = requestUrlParts.pop();
      const digestId = requestUrlParts.pop();
      const resource = requestUrlParts.pop();

      assert.equal(encodedEmail, encodeURI(btoa(email)), 'it makes a request to the api with correct encoded email');
      assert.equal(digestId, "1", 'it makes a request to the api with correct digest id');
      assert.equal(resource, "subscriptions", 'it makes a request for the right resource');
      done();
    });

    await visit(`/lists/${digest.id}/unsubscribe`);

    await fillIn(find('[data-test-field="unsubscribe-email"]'), email);

    await click('[data-test-component="unsubscribe-action"]');

  });
});
