import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
// import moment from 'moment';

moduleForAcceptance('Acceptance | dashboard', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /dashboard as an unauthenticated user', function(assert) {
  assert.expect(1);

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

/*
test('/dashboard tabs with content', function(assert) {
  assert.expect(5);

  // TODO the mixedContent method in mirage/config is throwing off the totals
  const news = server.createList('news', 2); // news is created twice
  const talk = server.createList('talk', 2);
  const market = server.createList('market-post', 2);
  const events = server.createList('event-instance', 2);

  visit('/dashboard');

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, 8, 'it should aggregate the content in one view');
  });

  click(testSelector('link', 'news'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, news.length, 'it should show only news content');
  });

  click(testSelector('link', 'events'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, events.length, 'it should show only events content');
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
*/

/* TODO this is going away. Not worth fixing.
test('/dashboard events tab only shows Edit link when publishedAt is after 2015-12-18', function(assert) {
  assert.expect(2);

  const events = server.createList('event-instance', 2);

  server.create('event-instance', {
    publishedAt: moment('2015-12-18').toISOString()
  });

  visit('/dashboard');
  click(testSelector('link', 'events'));

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, events.length + 1, 'it should show all events');
    assert.equal(find(testSelector('dashboard-content-edit-button')).length, events.length, 'it only shows Edit link when publishedAt is after 2015-12-18');
  });
});
*/

test('/dashboard tabs without content', function(assert) {
  assert.expect(1);

  visit('/dashboard');

  andThen(function() {
    assert.equal(find(testSelector('content-row')).length, 0, 'it should have no content');
  });
});

test('visiting /dashboard as an authenticated user with no content', function(assert) {
  assert.expect(1);

  visit('/dashboard');

  andThen(function() {
    assert.equal(currentURL(), '/dashboard');
  });
});

test('Visiting dashboard directly referencing new content', function(assert) {
  const market = server.create('market-post');

  visit('/dashboard?type=market&new_content=' + market.id);

  andThen(()=>{
    assert.ok(
      find(testSelector('component', 'publish-success-message').length > 0),
      "Should see successful publish message"
    );

    assert.ok(
      find(testSelector('content-item', market.id)).hasClass('highlight'),
      "Highlights element with referenced content item"
    );
  });

  click(testSelector('action', 'close-publish-success-message'));

  andThen(()=> {
    assert.ok(
      find(testSelector('component', 'publish-success-message').length === 0),
      "Message disappears after clicking close button"
    );

    assert.notOk(
      find(testSelector('content-item', market.id)).hasClass('highlight'),
      "Content item is no longer highlighted after clicking close button"
    );
  });
});
