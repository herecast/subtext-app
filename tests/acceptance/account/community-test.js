import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
//import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | account/community', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /account/community while not logged in', function(assert) {
  assert.expect(1);

  invalidateSession(this.application);
  visit('/account/community');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should redirect a non-logged in user to the sign in page');
  });
});

test('visiting /account/community', function(assert) {
  visit('/account/community');

  andThen(function() {
    assert.equal(currentURL(), '/account/community');
  });
});
