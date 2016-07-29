import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | homepage');

test('visiting /', function(assert) {
  server.createList('market-post', 5);
  server.createList('talk', 8);
  server.createList('news', 12);
  server.create('current-user', { canPublishNews: true });
  server.create('organization', { canPublishNews: true });

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    assert.equal(find(testSelector('link', 'news-channel')).length, 1, 'it should show the news channel link');
    assert.equal(find(testSelector('link', 'events-channel')).length, 1, 'it should show the events channel link');
    assert.equal(find(testSelector('link', 'talk-channel')).length, 1, 'it should show the talk channel link');
    assert.equal(find(testSelector('link', 'market-channel')).length, 1, 'it should show the market channel link');
    assert.equal(find(testSelector('link', 'directory-channel')).length, 1, 'it should show the directory channel link');
    assert.equal(find(testSelector('link', 'login-link')).length, 1, 'it should show the login link');
    assert.equal(find(testSelector('link', 'join-link')).length, 1, 'it should show the sign up link');
    assert.equal(find(testSelector('link', 'header-link')).length, 1, 'it should show the header link');

  });
});
