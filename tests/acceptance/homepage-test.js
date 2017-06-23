import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';

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
    assert.equal(find(testSelector('link', 'news-channel')).length, 1, 'it should show the news channel link');
    assert.equal(find(testSelector('link', 'events-channel')).length, 1, 'it should show the events channel link');
    assert.equal(find(testSelector('link', 'talk-channel')).length, 1, 'it should show the talk channel link');
    assert.equal(find(testSelector('link', 'market-channel')).length, 1, 'it should show the market channel link');
    assert.equal(find(testSelector('link', 'directory-channel')).length, 1, 'it should show the directory channel link');
    assert.equal(find(testSelector('link', 'login-link')).length, 1, 'it should show the login link');
    assert.ok(find(testSelector('link', 'header-link')).length, 'it should show the header link');
  });
});

test('news items for my location', function(assert) {
  const location1 = server.create('location');
  const newsItemsLocation1 = server.createList('news', 3);
  server.createList('news', 5);

  server.get('/news', function({news}, request) {
    const locationId = request.queryParams['location_id'];

    assert.equal(locationId, location1.id,
      "passes location_id to api");

    if(locationId === location1.id) {
      return news.find(newsItemsLocation1.mapBy('id'));
    } else {
      return news.all();
    }
  });

  visit(`/${location1.id}`);

  andThen(()=>{
    assert.equal(
      find(testSelector('news-card')).length, newsItemsLocation1.length,
      "Visiting located / displays news for that location"
    );

    newsItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('news-card', item.title)).length, 1);
    });
  });
});

test('market items for my location', function(assert) {
  const location1 = server.create('location');
  const marketItemsLocation1 = server.createList('market-post', 3, {
    imageUrl: "//the-image.jpg"
  });
  server.createList('market-post', 5, {
    imageUrl: "//the-image.jpg"
  });

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

  visit(`/${location1.id}`);

  andThen(()=>{
    assert.equal(
      find(testSelector('market-card')).length, marketItemsLocation1.length,
      "Visiting located / displays market items for that location"
    );

    marketItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('market-card', item.id)).length, 1);
    });
  });
});

test('event items for my location', function(assert) {
  const location1 = server.create('location');
  const eventItemsLocation1 = server.createList('event', 3);
  server.createList('event', 5);

  server.get('/events', function({events}, request) {
    const locationId = request.queryParams['location_id'];

    assert.equal(locationId, location1.id,
      "passes location_id to api");

    if(locationId === location1.id) {
      return events.find(eventItemsLocation1.mapBy('id'));
    } else {
      return events.all();
    }
  });

  visit(`/${location1.id}`);

  andThen(()=>{
    assert.equal(
      find(testSelector('event-card')).length, eventItemsLocation1.length,
      "Visiting located / displays event items for that location"
    );

    eventItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('event-card', item.id)).length, 1);
    });
  });
});

test('talk items for my location', function(assert) {
  const location1 = server.create('location');
  const currentUser = server.create('user', {locationId: location1.id, email: "embertest@subtext.org"});
  authenticateUser(this.application, server, currentUser);

  const talkItemsLocation1 = server.createList('talk', 3);
  server.createList('talk', 5);

  server.get('/talk', function({talks}, request) {
    const locationId = request.queryParams['location_id'];

    assert.equal(locationId, location1.id,
      "passes location_id to api");

    if(locationId === location1.id) {
      return talks.find(talkItemsLocation1.mapBy('id'));
    } else {
      return talks.all();
    }
  });

  visit(`/${location1.id}`);

  andThen(()=>{
    assert.equal(
      find(testSelector('talk-card')).length, talkItemsLocation1.length,
      "Visiting located / displays talk items for that location"
    );

    talkItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('talk-card', item.id)).length, 1);
    });
  });
});
