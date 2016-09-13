import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | lists/subscribe', {
  beforeEach() {
    server.createList('listserv', 10);
  }
});

test('visiting /lists/:id/subscribe when already subscribed redirects to /lists/:id/manage', function(assert) {

  const token = 'abcdefg';
  server.create('subscription', {
    id: token,
    confirmedAt: '2014-10-13T00:00:00.000Z',
    unusbscribedAt: null
  });

  visit(`/lists/${token}/subscribe`)
  .then(function() {
    assert.equal(currentURL(), `/lists/${token}/manage`, 'it should redirect to /manage');
  });
});

test('visiting /lists/:id/subscribe when subscriber is not a dUV user and no active session', function(assert) {
  invalidateSession(this.application);

  const token = 'abcdefg';
  server.create('subscription', {
    id: token,
    confirmedAt: null,
    unsubscribedAt: null,
    user: null
  });

  visit(`/lists/${token}/subscribe`);

  andThen(function() {
    assert.equal(find(testSelector('password-input')).length, 1, 'password prompt should show');
    assert.equal(find(testSelector('subscribe-button')).length, 1, 'subscribe button should show');
    assert.equal(find(testSelector('name-input')).length, 1, 'name input should show');
    assert.equal(find(testSelector('location-dropdown')).length, 1, 'name input should show');
  });
});

test('visiting /lists/:id/subscribe when subscriber is a dUV user and not signed in', function(assert) {
  invalidateSession(this.application);

  const token = 'abcdefg';
  server.create('subscription', {
    id: token,
    confirmedAt: null,
    unsubscribedAt: null,
    user: server.create('user')
  });

  visit(`/lists/${token}/subscribe`);

  andThen(function() {
    assert.equal(find(testSelector('password-input')).length, 1, 'password prompt should show');
    assert.equal(find(testSelector('subscribe-button')).length, 1, 'subscribe button should show');
    assert.equal(find(testSelector('name-input')).length, 0, 'name input should not show');
    assert.equal(find(testSelector('location-dropdown')).length, 0, 'name input should not show');
  });
});
