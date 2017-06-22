import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | adapter 401', {
  beforeEach() {
    invalidateSession(this.application);
    window.Intercom = function() {
    };
  }
});

test('Adapter receives 401 error during route transition', function(assert) {
  const location = mockLocationCookie(this.application);

  let user = server.create('user', {location_id: location.id, email: "embertest@subtext.org"});
  let talk = server.create('talk');

  server.get('/talk/:id', {message: 'unauthorized'}, 401);

  visit(`/talk/${talk.id}`);

  andThen(() => {
    assert.equal(currentRouteName(), 'login',
      "Should be directed to login page");

    server.get('/talk/:id'); //default functionality


    click(testSelector('action', 'change-sign-in-module'));

    fillIn(testSelector('field', 'sign-in-email'), user.email);
    fillIn(testSelector('field', 'sign-in-password'), 'password');

    click(testSelector('component', 'sign-in-submit'));

    andThen(() => {
      assert.equal(currentURL(), `/talk/${talk.id}`,
        "After signing in, should be directed back to original page"
      );
    });
  });
});
