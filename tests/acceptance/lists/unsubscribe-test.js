import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

/* global btoa */

moduleForAcceptance('Acceptance | lists/unsubscribe');

test('visiting unsubscribe url with listserv id', function(assert) {
  assert.expect(3);
  const done = assert.async();
  const listserv = server.create('listserv');
  const email = 'test@fake.co';

  server.delete('/subscriptions/:id/:token', (db, request) => {
    const requestUrlParts = request.url.split('/');
    const encodedEmail = requestUrlParts.pop();
    const listservId = requestUrlParts.pop();
    const resource = requestUrlParts.pop();

    assert.equal(encodedEmail, encodeURI(btoa(email)), 'it makes a request to the api with correct encoded email');
    assert.equal(listservId, "1", 'it makes a request to the api with correct listserv id');
    assert.equal(resource, "subscriptions", 'it makes a request for the right resource');
    done();
  });

  visit(`/lists/${listserv.id}/unsubscribe`).andThen(() => {
    const $emailField = find(testSelector('field', 'unsubscribe-email'));
    fillIn($emailField[0], email);

    click(testSelector('component', 'unsubscribe-action'));
  });
});
