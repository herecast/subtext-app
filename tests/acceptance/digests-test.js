import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | digests');

test('visiting /digests/:id/subscribe when user is not logged in and IS NOT a registered dailyuv member', function(assert) {
  assert.expect(5);
  invalidateSession(this.application);

  const digests = server.createList('digest', 3);
  const digest  = digests[1];
  server.create('current-user', { email: 'example@example.com'});

  visit(`/digests/${digest.id}/subscribe`);

  andThen(function() {
    assert.equal(find(testSelector('digest-name')).text().trim(), `Listserv Digest ${digest.id - 1}`, 'it shows the digest title');
    assert.equal(find(testSelector('digest-description')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
    assert.equal(find(testSelector('field', 'email')).length, 1, 'it has an input field for email');

    fillIn(testSelector('field', 'email'), 'nonmember@example.com');
    click(find(testSelector('button', 'submit')));

    andThen(function() {
      assert.equal(find(testSelector('success')).length, 0, 'i should not see a success message');
      assert.equal(currentURL(), '/sign_up?email=nonmember%40example.com', 'when i submit the subscription form i am redirected to the registration page with my email prefilled');
    });
  });
});

test('visiting /digests/:id/subscribe when user is not logged in and IS a registered dailyuv member', function(assert) {
  assert.expect(5);
  invalidateSession(this.application);

  const digests = [];
  const listservs = server.createList('listserv', 3);
  listservs.forEach((listserv) => {
    digests.push(server.create('digest', {id: listserv.id}));
  });
  const digest  = digests[1];
  const user    = server.create('current-user', { email: 'example@example.com'});

  visit(`/digests/${digest.id}/subscribe`);

  andThen(function() {
    const startingUrl = currentURL();

    andThen(function() {
      assert.equal(find(testSelector('digest-name')).text().trim(), `Listserv Digest ${digest.id - 1}`, 'it shows the digest title');
      assert.equal(find(testSelector('digest-description')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
      assert.equal(find(testSelector('field', 'email')).length, 1, 'it has an input field for email');

      fillIn(testSelector('field', 'email'), user.email);
      click(find(testSelector('button', 'submit')));

      andThen(function() {
        assert.equal(currentURL(), startingUrl, 'when i submit the subscription form i am not redirected');
        assert.equal(find(testSelector('success')).length, 1, 'i am shown a success message');
      });
    });
  });
});

test('visiting /digests/:id/subscribe when user is logged in as a registered dailyuv member', function(assert) {
  assert.expect(6);

  authenticateUser(this.application, server, server.create(
    'current-user', { email: 'example@example.com' })
  );

  const digests = server.createList('digest', 3);
  const digest  = digests[1];

  visit(`/digests/${digest.id}/subscribe`);

  andThen(function() {
    const startingUrl = currentURL();

		assert.equal(find(testSelector('digest-name')).text().trim(), `Listserv Digest ${digest.id - 1}`, 'it shows the digest title');
		assert.equal(find(testSelector('digest-description')).text().trim(), `${digest.digestDescription}`, 'it shows the digest description');
    assert.equal(find(testSelector('field', 'email')).length, 0, 'it does not have an input field for email');
    assert.equal(find(testSelector('logged-in')).length, 1, 'it indicates i am logged in');

    click(find(testSelector('button', 'submit')));

    andThen(function() {
			assert.equal(currentURL(), startingUrl, 'when i submit the subscription form i am not redirected');
			assert.equal(find(testSelector('success')).length, 1, 'i am shown a success message');
    });
  });
});
