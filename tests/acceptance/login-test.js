import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | login', {
  beforeEach() {
    window.Intercom = function() {
    };
  }
});

test('logging in works', function(assert) {
  assert.expect(2);

  let location = server.create('location');
  let user = server.create('user', {location_id: location.id});

  visit('/sign_in');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should be at the correct url to login');
  });

  fillIn(testSelector('component', 'login-email'), user.email);
  fillIn(testSelector('component', 'login-password'), 'password');

  click(testSelector('component', 'login-submit'));

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url after logging in');
  });
});

test('visiting protected page while not logged in redirects to login page then back', function(assert) {
  assert.expect(2);

  let location = server.create('location');
  let user = server.create('user', {location_id: location.id});

  const protectedUrl = '/talk';

  visit(protectedUrl);

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should be redirected to the login page');
  });

  fillIn(testSelector('component', 'login-email'), user.email);
  fillIn(testSelector('component', 'login-password'), 'password');

  click(testSelector('component', 'login-submit'));

  andThen(function() {
    assert.equal(currentURL(), protectedUrl, 'it should be at the correct url after logging in');
  });
});

test('logging out works', function(assert) {
  assert.expect(4);

  authenticateSession(this.application);

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
  assert.expect(1);

  authenticateSession(this.application);

  visit('/sign_in');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
  });
});

test('clicking sign in link redirects to login page', function(assert) {
  assert.expect(2);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/', 'it should be at the correct url');
  });

  click(testSelector('link', 'login-link'));

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should be at the login url');
  });
});
