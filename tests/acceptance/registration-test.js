import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | registration');

const registrationPage = {
  visit() {
    return visit('/sign_up');
  }
};

const registrationMenuOrPage = {
  visit() {
    return visit('/');
  },

  open() {
    this.visit();
    click(testSelector('link', 'login-link'));
    click(testSelector('link', 'join-tab'));
  },

  submit() {
    return click(testSelector('component', 'sign-in-submit'));
  },

  element() {
    return find(testSelector('component', 'sign-in-submit'));
  },

  email(email) {
    return fillIn(testSelector('field', 'sign-in-email'), email);
  },

  password(password) {
    return fillIn(testSelector('field', 'sign-in-password'), password);
  }
};

test('clicking join link displays the registration form', function(assert) {
  registrationMenuOrPage.open();

  andThen(() => {
    assert.equal(registrationMenuOrPage.element().length, 1, 'registration form should be present');
  });
});

test('registration works', function(assert) {
  assert.expect(1);

  mockLocationCookie(this.application);

  registrationMenuOrPage.open();

  registrationMenuOrPage.email('slim_shady@example.com');
  registrationMenuOrPage.password('willtherealslimshadypleasestandup1');

  registrationMenuOrPage.submit();

  andThen(function() {
    assert.equal(currentURL(), '/sign_up/complete', 'it should be at the confirmation page after registration');
  });
});

test('visiting registration page while already authenticated redirects to root page', function(assert) {
  assert.expect(1);
  authenticateSession(this.application);

  registrationPage.visit();

  andThen(function() {
    assert.equal(currentPath(), 'feed.index', 'it should redirect to the correct url when the user is already authenticated');
  });
});


