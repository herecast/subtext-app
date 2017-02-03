import mailtoHref from 'subtext-ui/utils/mailto-href';
import { module, test } from 'qunit';

module('Unit | Utility | mailto href');

// Replace this with your real tests.
test('it works', function(assert) {
  let email = 'test@subtext.org';
  let options = {
    subject: 'Email Subject',
    body: 'Email Body'
  };

  let shouldBe = 'mailto:test@subtext.org?subject=Email%20Subject&body=Email%20Body';

  assert.equal(mailtoHref(email, options), shouldBe, 'it converts mailto properly');
});
