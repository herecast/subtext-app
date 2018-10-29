import emailIsValid from 'subtext-ui/utils/email-is-valid';
import { module, test } from 'qunit';

module('Unit | Utility | email is valid', function() {
  // Replace this with your real tests.
  test('validates real emails', function(assert) {
    assert.equal(emailIsValid('asdf@asdf.com'), true, 'rasdf@asdf.com is a valid email address');
    assert.equal(emailIsValid('asdf@asdf.co'), true, 'rasdf@asdf.co is a valid email address');
    assert.equal(emailIsValid('asdf@asdf.us'), true, 'rasdf@asdf.us is a valid email address');
  });

  test('invalidates bad emails', function(assert) {
    assert.equal(emailIsValid('asdf.com'), false, 'asdf.com is not a valid email address');
    assert.equal(emailIsValid('asdf.asdf.co'), false, 'asdf.asdf.co is not a valid email address');
    assert.equal(emailIsValid('@asdf'), false, '@asdf is not a valid email address');
  });
});
