import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | dashboard', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /dashboard as an unauthenticated user', function(assert) {
  invalidateSession(this.application);
  visit('/dashboard');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it redirects to the sign in page');
  });
});

test('/dashboard account details', function(assert) {
  assert.expect(0);
});

test('/dashboard my community', function(assert) {
  assert.expect(0);
});

test('/dashboard new content button', function(assert) {
  assert.expect(0);
});

test('/dashboard change org drop down', function(assert) {
  assert.expect(0);
});

test('/dashboard tabs with content', function(assert) {
  // TODO the mixedContent method in mirage/config is throwing off the totals
  const news = server.createList('news', 2); // news is created twice
  const talk = server.createList('talk', 2);
  const market = server.createList('market-post', 2);

  visit('/dashboard');

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, 8, 'it should aggregate the content in one view');
  });

  click(testSelector('link', 'news'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, news.length, 'it should show only news content');
  });

  click(testSelector('link', 'talk'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, talk.length, 'it should show only talk content');
  });

  click(testSelector('link', 'market'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, market.length, 'it should show only market content');
  });
});

test('/dashboard tabs without content', function(assert) {
  visit('/dashboard');

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, 0, 'it should have no content');
  });
});

test('visiting /dashboard as an authenticated user with no content', function(assert) {
  visit('/dashboard');

  andThen(function() {
    assert.equal(currentURL(), '/dashboard');
  });
});
