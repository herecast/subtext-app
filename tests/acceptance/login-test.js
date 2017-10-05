import { test, skip } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
    invalidateSession(this.application);
      window.Intercom = function() {
    };
    // Default location as specified in user-location service
    server.create('location', {
      id: 'hartford-vt'
    });
  }
});

test('Follow sign in link, authentication succeeds', function(assert) {
  const done = assert.async();
  const user = server.create('user');
  const token = "sakj342qk223dk";

  server.post('/users/sign_in_with_token', function({currentUsers}, request) {
    const data = JSON.parse(request.requestBody);

    assert.equal(data.token, token, "Posts token to correct server endpoint");

    currentUsers.create(user.attrs);
    done();
    return {
      email: user.email,
      token: 'sak;329jk;skdfh'
    };
  });

  visit('/sign_in?auth_token=' + token);

  andThen(() => {
    assert.equal(
      currentPath(),'index',
      "Should be on home page");

    assert.equal(
      find(testSelector('link', 'user-menu')).length, 1,
      "I should see my user menu (I am signed in)");
  });
});

test('Follow sign in link, authentication fails', function(assert) {
  const token = "sakj342qk223dk";

  server.post('/users/sign_in_with_token', {error: 'Token expired'}, 422);

  visit('/sign_in?auth_token=' + token);

  andThen(() => {
    assert.equal(
      find(testSelector('component', 'sign-in')).length, 1,
      "I should see sign in");
  });
});

test('logging in works', function(assert) {
  let location = server.create('location');
  let user = server.create('user', {location_id: location.id, email: "embertest@subtext.org"});

  visit('/');

  click(testSelector('link', 'login-link'));

  fillIn(testSelector('field', 'sign-in-email'), user.email);
  fillIn(testSelector('field', 'sign-in-password'), 'password');

  click(testSelector('component', 'sign-in-submit'));
  click(testSelector('link', 'user-menu'));

  andThen(function() {
    assert.ok(find(testSelector('link','logout-link')).length, 'Should see logout link');
  });
});

skip('using incorrect login information', function(assert) {
  let location = server.create('location');
  let user = server.create('user', {location_id: location.id});

  visit('/');

  click(testSelector('link', 'login-link'));

  click(testSelector('action', 'change-sign-in-module'));

  fillIn(testSelector('field', 'sign-in-email'), user.email + "not-correct");
  fillIn(testSelector('field', 'sign-in-password'), 'password');

  click(testSelector('component', 'sign-in-submit'));

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

test('logging out works', function(assert) {
  let user = server.create('user');
  authenticateUser(this.application, server, user);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
    assert.equal(find(testSelector('link', 'login-link')).length, 0, 'it should not show the sign in link');
  });

  click(testSelector('link', 'user-menu'));
  click(testSelector('link', 'logout-link'));

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
    assert.ok(find(testSelector('component','sign-in')).length,
      "Displays sign in");
  });
});

