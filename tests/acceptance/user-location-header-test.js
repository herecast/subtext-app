import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | user-location-header');

test('When not signed in, visiting /', function(assert) {
  visit('/');
  andThen(()=>{
    const $header = find(testSelector('component', 'global-header'));
    const $userLocation = find(testSelector('user-location'), $header);

    assert.equal($userLocation.length, 0,
      "Should not see user location in header"
    );
  });
});

test('When signed in, visiting /', function(assert) {
  const user = authenticateUser(
    this.application,
    server
  );

  visit('/');
  andThen(()=>{
    const $header = find(testSelector('component', 'global-header'));
    const $userLocation = find(testSelector('user-location'), $header);

    assert.equal($userLocation.text().trim(), user.location,
      "Should see user location in header"
    );
  });
});
