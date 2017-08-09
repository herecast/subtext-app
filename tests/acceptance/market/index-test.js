import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | /{location-slug}/market/index', {
  beforeEach() {
    this.location = server.create('location');
  }
});

test('visiting', function(assert) {
  const marketItemsLocation1 = server.createList('market-post', 3, {
    imageUrl: "//the-image.jpg"
  });
  server.createList('market-post', 4);

  const location1 = this.location;
  server.get('/market_posts', function({marketPosts}, request) {
    const locationId = request.queryParams['location_id'];

    assert.equal(locationId, location1.id,
      "passes location_id to api");


    if(locationId === location1.id) {
      return marketPosts.find(marketItemsLocation1.mapBy('id'));
    } else {
      return marketPosts.all();
    }
  });

  const url = `/${this.location.id}/market`;
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url);
    assert.equal(find(testSelector('link', 'content-create-button')).length, 1, 'it should show the create content button');

    assert.equal(
      find(testSelector('market-card')).length, marketItemsLocation1.length,
      "Visiting page, located displays market items for that location"
    );

    marketItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('market-card', item.id)).length, 1);
    });

  });
});

test('visiting with 10 items lists all 10 items', function(assert) {
  assert.expect(3);
  server.createList('market-post', 10);

  // visiting the old market
  const url = `/${this.location.id}/market`;
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url, 'it should be at the correct url');
    assert.equal(find(testSelector('market-card')).length, 10, 'it should list all 10 market cards');

    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show pagination buttons');
  });
});

test('visiting with 50 items is paginated', function(assert) {
  assert.expect(15);
  server.createList('market-post', 50);
  const location = this.location;

  const url = `/${location.id}/market`;
  visit(url);

  andThen(function() {
    assert.equal(currentURL(), url, 'it should be at the url /market');
    assert.equal(find(testSelector('market-card')).length, 24, 'it should show 24 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not show the "prev" button on the first page');
    assert.equal(find(testSelector('pagination-first')).length, 0, 'it should not show the "first" button on the first page');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should show the "next" button once on the first page');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), `/${location.id}/market?page=2`, 'it should be at the url /{location.id}/market?page=2');
    assert.equal(find(testSelector('market-card')).length, 24, 'it should show 24 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should show the "prev" button once on the second page');
    assert.equal(find(testSelector('pagination-first')).length, 1, 'it should show the "first" button once on the second page');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should show the "next" button once on the second page');
  });

  click(testSelector('pagination-next'));

  andThen(function() {
    assert.equal(currentURL(), `/${location.id}/market?page=3`, 'it should be at the url /{location.id}/market?page=3');
    assert.equal(find(testSelector('market-card')).length, 2, 'it should show 2 market cards');

    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should show the "prev" button once on the last page');
    assert.equal(find(testSelector('pagination-first')).length, 1, 'it should show the "first" button once on the last page');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not show the "next" button on the last page');
  });

});
