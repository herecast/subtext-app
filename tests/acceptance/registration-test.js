import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | registration');

test('clicking join link redirects to registration page', function(assert) {
  assert.expect(1);

  visit('/');

  click(testSelector('link', 'join-link'));

  andThen(function() {
    assert.equal(currentURL(), '/sign_up', 'it should redirect to registration link after clicking join');
  });
});

test('registration works', function(assert) {
  assert.expect(2);

  const locations = server.createList('location', 8);
  visit('/sign_up');

  andThen(function() {
    assert.equal(currentURL(), '/sign_up', 'it should be at the correct url to register');
  });

  fillIn(testSelector('component', 'location-dropdown'), locations[0].id);
  fillIn(testSelector('component', 'register-name-input'), 'Marshall Mathers');
  fillIn(testSelector('component', 'register-email-input'), 'slim_shady@example.com');
  fillIn(testSelector('component', 'register-password-input'), 'willtherealslimshadypleasestandup1');
  click('#terms');
  click(testSelector('component', 'register-submit-button'));

  andThen(function() {
    assert.equal(currentURL(), '/sign_up/complete', 'it should be at the confirmation page after registration');
  });
});

test('registration requires clicking I agree', function(assert) {
  assert.expect(2);

  const locations = server.createList('location', 8);
  visit('/sign_up');

  andThen(function() {
    assert.equal(currentURL(), '/sign_up', 'it should be at the correct url to register');
  });

  fillIn(testSelector('component', 'location-dropdown'), locations[0].id);
  fillIn(testSelector('component', 'register-name-input'), 'Marshall Mathers');
  fillIn(testSelector('component', 'register-email-input'), 'slim_shady@example.com');
  fillIn(testSelector('component', 'register-password-input'), 'willtherealslimshadypleasestandup1');
  click(testSelector('component', 'register-submit-button'));

  andThen(function() {
    assert.equal(currentURL(), '/sign_up', 'it should not redirect if user attempts to join without clicking I agree');
  });
});

test('visiting registration page while already authenticated redirects to root page', function(assert) {
  assert.expect(1);

  authenticateSession(this.application);
  visit('/sign_up');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should redirect to the correct url when the user is already authenticated');
  });
});
