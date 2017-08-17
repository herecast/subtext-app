import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | homepage');

test('visiting /, not located', function(assert) {
  const locations = server.createList('location', 3);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');

    assert.equal(
      find(testSelector('component', 'location-menu')).length, 1,
      "I should see the location menu");
  });

  click(
    '[data-test-link=choose-location][data-test-location=' + locations[0].id + ']'
  );

  andThen(function() {
    assert.equal(
      currentURL(),
      `/${locations[0].id}`,
      "Clicking on a location takes me to the root page for that location");
  });
});

test('Location in cookie, visit /', function(assert) {
  const location = mockLocationCookie(this.application);

  visit('/');

  andThen(()=>{
    assert.equal(currentURL(), `/${location.id}`,
      "Redirects to located index with location id");
  });

  andThen(function() {
    assert.equal(find(testSelector('link', 'login-link')).length, 1, 'it should show the login link');
    assert.ok(find(testSelector('link', 'header-link')).length, 'it should show the header link');
  });
});
