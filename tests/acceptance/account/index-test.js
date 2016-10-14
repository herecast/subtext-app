import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
//import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | account/index', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /account/ while not logged in', function(assert) {
  assert.expect(1);

  invalidateSession(this.application);
  visit('/account/');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should redirect a non-logged in user to the sign in page');
  });
});

test('visiting /account/', function(assert) {
  assert.expect(1);
  visit('/account/');

  andThen(function() {
    assert.equal(currentURL(), '/account/');
  });
});
