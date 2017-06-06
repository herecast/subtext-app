import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | talk/index', {
  beforeEach() {
    this.user = authenticateUser(this.application, server);
  }
});

test('visiting /talk/ while not logged in', function(assert) {
  assert.expect(1);

  invalidateSession(this.application);
  visit('/talk/');

  andThen(function() {
    assert.equal(
      currentURL(),
      '/sign_in',
      "Should be redirected to sign in");
  });
});

test('visiting /talk/', function(assert) {
  assert.expect(2);

  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the /talk/ url');
    assert.equal(find(testSelector('link', 'content-create-button')).length, 1, 'it should show the Create Talk button');
  });
});

test('visiting /talk/ with 10 items lists all 10 items', function(assert) {
  assert.expect(3);

  server.createList('talk', 10);

  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the /talk/ url');
    assert.equal(find(testSelector('talk-card')).length, 10, 'it should list all 10 talk cards');

    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show pagination buttons');
  });
});

test('visiting /talk/ with 50 items is paginated', function(assert) {
  assert.expect(15);

  server.createList('talk', 50);

  visit('/talk/');

  andThen(function() {
    assert.equal(currentURL(), '/talk/', 'it should be at the url /talk/');
    assert.equal(find(testSelector('talk-card')).length, 24, 'it should show 24 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not show the "prev" button');
    assert.equal(find(testSelector('pagination-first')).length, 0, 'it should not show the "first" button');
    assert.equal(find(testSelector('pagination-next')).length, 2, 'it should show the "next" button twice');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/talk?page=2', 'it should be at the url /talk?page=2');
    assert.equal(find(testSelector('talk-card')).length, 24, 'it should show 24 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 2, 'it should show the "prev" button twice');
    assert.equal(find(testSelector('pagination-first')).length, 2, 'it should show the "first" button twice');
    assert.equal(find(testSelector('pagination-next')).length, 2, 'it should show the "next" button twice');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/talk?page=3', 'it should be at the url /talk?page=3');
    assert.equal(find(testSelector('talk-card')).length, 2, 'it should show 2 talk cards');

    assert.equal(find(testSelector('pagination-prev')).length, 2, 'it should show the "prev" button twice');
    assert.equal(find(testSelector('pagination-first')).length, 2, 'it should show the "first" button twice');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show the "next" button');
  });

});
