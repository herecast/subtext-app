import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
    invalidateSession(this.application);
    window.Intercom = function() {
    };
  }
});

test('logging in works', function(assert) {
  let location = server.create('location');
  let user = server.create('user', {location_id: location.id});

  visit('/');

  click(testSelector('link', 'login-link'));

  fillIn(testSelector('field', 'login-email'), user.email);
  fillIn(testSelector('field', 'login-password'), 'password');

  click(testSelector('component', 'login-submit'));

  andThen(function() {
    assert.ok(find(testSelector('component','logout-link')).length, 'Should see logout link');
  });
});

test('using incorrect login information', function(assert) {
  let location = server.create('location');
  let user = server.create('user', {location_id: location.id});

  visit('/');

  click(testSelector('link', 'login-link'));

  fillIn(testSelector('field', 'login-email'), user.email + "not-correct");
  fillIn(testSelector('field', 'login-password'), 'password');

  click(testSelector('component', 'login-submit'));

  andThen(function() {
    // Email
    const $emailField = find(testSelector('field', 'login-email'));
    let $formGroup = $emailField.closest('.form-group');
    assert.ok($formGroup.hasClass('has-error'),
      "It marks email form-group as error");

    // Password
    const $passwordField = find(testSelector('field', 'login-password'));
    $formGroup = $passwordField.closest('.form-group');
    assert.ok($formGroup.hasClass('has-error'),
      "It marks password form-group as error");
  });
});

test('visiting protected page while not logged in redirects to login page then back', function(assert) {
  let user = server.create('user');

  const protectedUrl = '/talk';

  visit(protectedUrl);

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should be redirected to the login page');
  });

  fillIn(testSelector('field', 'login-email'), user.email);
  fillIn(testSelector('field', 'login-password'), 'password');

  click(testSelector('component', 'login-submit'));

  andThen(function() {
    assert.equal(currentURL(), protectedUrl, 'it should be at the correct url after logging in');
  });
});

test('logging out works', function(assert) {
  let user = server.create('user');
  authenticateUser(this.application, server, user);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
    assert.equal(find(testSelector('link', 'login-link')).length, 0, 'it should not show the sign in link');
  });

  click(testSelector('component', 'logout-link'));

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url after logging out');
    assert.equal(find(testSelector('link', 'login-link')).length, 1, 'it should show the sign in link');
  });
});

test('visiting log in page while already authenticated redirects to root page', function(assert) {
  let user = server.create('user');
  authenticateUser(this.application, server, user);

  visit('/sign_in');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
  });
});

test('clicking sign in link displays login form', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
  });

  click(testSelector('link', 'login-link'));

  andThen(function() {
    assert.ok(find(testSelector('component','sign-in-form')).length,
      "Displays sign in form");
  });
});
