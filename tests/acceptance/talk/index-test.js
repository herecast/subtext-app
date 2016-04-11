import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | talk/index', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /talk/ while not logged in', function(assert) {
  invalidateSession(this.application);
  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/sign_in', 'it should redirect a non-logged in user to the sign in page');
  });
});

test('visiting /talk/', function(assert) {
  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the /talk/ url');
    assert.equal(find(testSelector('link', 'content-create-button')).length, 1, 'it should show the Create Talk button');
  });
});

test('visiting /talk/ with 10 items lists all 10 items', function(assert) {
  server.createList('talk', 10);

  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the /talk/ url');
    assert.equal(find(testSelector('talk-length')).text(), 10, 'it should display "Showing 10 talks."');
    assert.equal(find(testSelector('talk-card')).length, 10, 'it should list all 10 talk cards');

    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show pagination buttons');
  });
});

test('visiting /talk/ with 50 items is paginated', function(assert) {
  server.createList('talk', 50);

  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the url /talk/');
    assert.equal(find(testSelector('talk-length')).text(), 24, 'it should display "Showing 24 talks."');
    assert.equal(find(testSelector('talk-card')).length, 24, 'it should show 24 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not show the "prev" button');
    assert.equal(find(testSelector('pagination-first')).length, 0, 'it should not show the "first" button');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should show the "next" button once');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/talk?page=2', 'it should be at the url /talk?page=2');
    assert.equal(find(testSelector('talk-length')).text(), 24, 'it should display "Showing 24 talks."');
    assert.equal(find(testSelector('talk-card')).length, 24, 'it should show 24 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 2, 'it should show the "prev" button twice');
    assert.equal(find(testSelector('pagination-first')).length, 2, 'it should show the "first" button twice');
    assert.equal(find(testSelector('pagination-next')).length, 2, 'it should show the "next" button twice');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/talk?page=3', 'it should be at the url /talk?page=3');
    assert.equal(find(testSelector('talk-length')).text(), 2, 'it should display "Showing 2 talks."');
    assert.equal(find(testSelector('talk-card')).length, 2, 'it should show 2 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 2, 'it should show the "prev" button twice');
    assert.equal(find(testSelector('pagination-first')).length, 2, 'it should show the "first" button twice');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show the "next" button');
  });

});
