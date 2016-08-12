import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | market/index');

test('visiting /market/', function(assert) {
  assert.expect(2);
  visit('/market/');

  andThen(function() {
    assert.equal(currentURL(), '/market/');
    assert.equal(find(testSelector('link', 'content-create-button')).length, 1, 'it should show the create content button');
  });
});

test('visiting /market/ with 10 items lists all 10 items', function(assert) {
  assert.expect(3);
  server.createList('market-post', 10);

  visit('/market/');

  andThen(function() {
    assert.equal(currentURL(), '/market/', 'it should be at the correct url');
    assert.equal(find(testSelector('market-card')).length, 10, 'it should list all 10 market cards');

    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show pagination buttons');
  });
});

test('visiting /market/ with 50 items is paginated', function(assert) {
  assert.expect(15);
  server.createList('market-post', 50);

  visit('/market/');

  andThen(function() {
    assert.equal(currentURL(), '/market/', 'it should be at the url /market/');
    assert.equal(find(testSelector('market-card')).length, 24, 'it should show 24 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not show the "prev" button on the first page');
    assert.equal(find(testSelector('pagination-first')).length, 0, 'it should not show the "first" button on the first page');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should show the "next" button once on the first page');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/market?page=2', 'it should be at the url /market?page=2');
    assert.equal(find(testSelector('market-card')).length, 24, 'it should show 24 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should show the "prev" button once on the second page');
    assert.equal(find(testSelector('pagination-first')).length, 1, 'it should show the "first" button once on the second page');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should show the "next" button once on the second page');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), '/market?page=3', 'it should be at the url /market?page=3');
    assert.equal(find(testSelector('market-card')).length, 2, 'it should show 2 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should show the "prev" button once on the last page');
    assert.equal(find(testSelector('pagination-first')).length, 1, 'it should show the "first" button once on the last page');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show the "next" button on the last page');
  });

});
