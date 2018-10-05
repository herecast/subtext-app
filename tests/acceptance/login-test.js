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

test('Follow sign in link, authentication succeeds', function(assert) {
  const done = assert.async();
  const user = server.create('current-user');
  const token = "sakj342qk223dk";

  server.post('/users/sign_in_with_token', function({currentUsers}, request) {
    const data = JSON.parse(request.requestBody);

    assert.equal(data.token, token, "Posts token to correct server endpoint");

    currentUsers.create(user.attrs);
    done();
    return {
      email: user.email,
      token
    };
  });

  visit('/sign_in?auth_token=' + token);

  andThen(() => {
    assert.equal(
      currentPath(),'feed.index',
      "Should be on feed home page");

    assert.equal(
      find(testSelector('link', 'user-avatar')).length, 1,
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
  let user = server.create('current-user', {location_id: location.id, email: "embertest@subtext.org"});

  visit('/');

  click(testSelector('signin-from-header'));
  click(testSelector('signin-from-side-menu'));

  andThen(() => {
    fillIn(testSelector('field', 'sign-in-email'), user.email);
    fillIn(testSelector('field', 'sign-in-password'), 'password');

    click(testSelector('component', 'sign-in-submit'));

    andThen(() => {
      click(testSelector('link', 'user-avatar'));

      andThen(() => {
        assert.ok(find(testSelector('link','logout-link')).length, 'Should see logout link');
      });
    });
  });

});

test('logging out works', function(assert) {
  let user = server.create('current-user');
  authenticateUser(this.application, server, user);

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('signin-from-header')).length, 0, 'it should not show the sign in link');
  });

  click(testSelector('link', 'user-avatar'));
  click(testSelector('link', 'logout-link'));
  click(testSelector('logout-yes'));

  andThen(function() {
    assert.equal(find(testSelector('signin-from-header')).length, 1, 'it should show the sign in link');
  });
});

test('visiting log in page while already authenticated redirects to root page', function(assert) {
  let user = server.create('current-user');
  authenticateUser(this.application, server, user);

  visit('/sign_in');

  andThen(function() {
    assert.equal(currentPath(), 'feed.index', 'it should be at the correct url');
  });
});

test('clicking sign in link displays login form', function(assert) {
  visit('/');

  click(testSelector('signin-from-header'));
  click(testSelector('signin-from-side-menu'));

  andThen(function() {
    assert.ok(find(testSelector('component', 'sign-in')).length, "Displays sign in");
  });
});
