import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | registration');

test('clicking join link displays the registration form', function(assert) {
  visit('/');

  click(testSelector('link', 'join-link'));

  andThen(() => {
    let $registrationForm = find(testSelector('component', 'registration-form'));
    assert.ok($registrationForm.length > 0);
  });
});

test('registration works', function(assert) {
  assert.expect(1);

  const locations = server.createList('location', 8);
  visit('/');
  click(testSelector('link', 'join-link'));

  fillIn(testSelector('component', 'location-dropdown'), locations[0].id);
  fillIn(testSelector('component', 'register-name-input'), 'Marshall Mathers');
  fillIn(testSelector('component', 'register-email-input'), 'slim_shady@example.com');
  fillIn(testSelector('component', 'register-password-input'), 'willtherealslimshadypleasestandup1');
  click(testSelector('component', 'register-terms'));
  click(testSelector('component', 'register-submit-button'));

  andThen(function() {
    assert.equal(currentURL(), '/sign_up/complete', 'it should be at the confirmation page after registration');
  });
});

test('registration requires clicking I agree', function(assert) {
  assert.expect(1);

  const locations = server.createList('location', 8);
  visit('/');
  click(testSelector('link', 'join-link'));

  fillIn(testSelector('component', 'location-dropdown'), locations[0].id);
  fillIn(testSelector('component', 'register-name-input'), 'Marshall Mathers');
  fillIn(testSelector('component', 'register-email-input'), 'slim_shady@example.com');
  fillIn(testSelector('component', 'register-password-input'), 'willtherealslimshadypleasestandup1');
  click(testSelector('component', 'register-submit-button'));

  andThen(function() {
    assert.notEqual(currentURL(), '/sign_up/complete', 'it should not redirect if user attempts to join without clicking I agree');
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
