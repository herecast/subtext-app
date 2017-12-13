import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';

moduleForAcceptance('Acceptance | feed', {
  beforeEach() {
    this.cookies = {};
    mockCookies(this.application, this.cookies);

    invalidateSession(this.application);
    window.Intercom = function() {};
  }
});


test('visiting /feed with location previously selected ', function(assert) {
  const done = assert.async();

  const location = mockLocationCookie(this.application);

  server.createList('feedContent', 3, {
    contentLocations: [{
      id: 1,
      location_type: 'base',
      location_id: location.id
    }]
  });

  server.get('/contents', function({feedItems}, request) {
    if(request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id,
        location.id,
        "The correct location id is passed to the api request");
      done();
    }

    return feedItems.all();
  });


  const feedItems = server.createList('feedItem', 3, {
    modelType: 'feedContent'
  });

  visit('/feed');

  andThen(()=>{
    assert.equal(currentURL(), `/feed?location=${location.id}`,
      "Redirects to feed with location parameter"
    );

    feedItems.forEach((record) => {
      const $feedCard = find(
        testSelector('feed-card') +
        testSelector('content', record.feedContent.id)
      );
      assert.ok($feedCard.length,
        `A feed card exists for content id: ${record.feedContent.id}`);
    });
  });
});

test('visiting /feed?location= with location in url', function(assert) {
  const done = assert.async();

  const location = mockLocationCookie(this.application);

  server.createList('feedContent', 3, {
    contentLocations: [{
      id: 1,
      location_type: 'base',
      location_id: location.id
    }]
  });

  server.get('/contents', function({feedItems}, request) {
    if(request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id,
        location.id,
        "The correct location id is passed to the api request");
      done();
    }

    return feedItems.all();
  });

  const feedItems = server.createList('feedItem', 3, {
    modelType: 'feedContent'
  });

  visit('/feed?location=' + location.id);

  andThen(()=>{
    feedItems.forEach((record) => {
      const $feedCard = find(
        testSelector('feed-card') +
        testSelector('content', record.feedContent.id)
      );
      assert.ok($feedCard.length,
        `A feed card exists for content id : ${record.feedContent.id}`);
    });
  });
});

test('visiting feed show page no location in url or cookie', function(assert) {
  const feedRecord = server.create('feedContent');

  visit('/feed/' + feedRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(), 'feed.show',
      'it does not redirect to location menu');
  });
});

test("feed show page, news", function(assert) {
  const feedRecord = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'news'
  });

  visit('/feed/' + feedRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show'
    );

    const $newsDetail = find(
      testSelector('component', 'news-detail') +
      testSelector('content', feedRecord.id)
    );

    assert.ok($newsDetail.length, 'Displays news detail');
  });
});

test('feed show page, market post', function(assert) {
  const feedRecord = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'market'
  });

  visit('/feed/' + feedRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show'
    );

    const $marketDetail = find(
      testSelector('component', 'market-detail') +
      testSelector('content', feedRecord.id)
    );

    assert.ok($marketDetail.length, 'Displays market detail');
  });
});

test('feed show page, talk', function(assert) {
  const feedRecord = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'talk'
  });

  visit('/feed/' + feedRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show'
    );

    const $talkDetail = find(
      testSelector('component', 'talk-detail') +
      testSelector('content', feedRecord.id)
    );

    assert.ok($talkDetail.length, 'Displays talk detail');
  });
});

test('feed show page, event with instance id', function(assert) {
  const eventInstance = server.create('event-instance');
  const feedRecord = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'event',
    eventInstances: [
      eventInstance
    ],
    eventInstanceId: eventInstance.id
  });

  visit(`/feed/${feedRecord.id}/${eventInstance.id}`);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show-instance'
    );

    const $eventDetail = find(
      testSelector('component', 'event-detail') +
      testSelector('content', eventInstance.contentId)
    );

    assert.ok($eventDetail.length, 'Displays event detail');
  });
});

test('feed show page, event no instance id', function(assert) {
  const eventInstance = server.create('event-instance');
  const feedRecord = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'event',
    eventInstances: [
      eventInstance
    ],
    eventInstanceId: eventInstance.id
  });

  visit(`/feed/${feedRecord.id}`);

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/feed/${feedRecord.id}/${eventInstance.id}`,
      'it redirects to instance route'
    );
  });
});

test('radius control, api radius parameter', function(assert) {
  const done = assert.async(4);

  const loc = server.create('location');
  let radius = 10;

  server.get('/contents', function(db, request) {
    assert.equal(request.queryParams.radius, radius,
      `Api endpoint called with radius: ${radius}`
    );
    done();

    return db.feedContents.all();
  });

  visit('/feed?location=' + loc.id);

  andThen(()=>{
    radius = 20;
    click(
      testSelector('action', 'change-radius') +
      testSelector('radius', 20)
    );
  });
});

test('location control', function(assert) {
  const done = assert.async(2);

  const location1 = server.create('location');
  const location2 = server.create('location');

  visit('/feed?location=' + location1.id);

  andThen(()=>{
    server.get('/contents', function(db, request) {
      assert.equal(request.queryParams.location_id, location2.id,
        `Api endpoint called with location selected from location selector`
      );
      done();

      return db.feedContents.all();
    });
    click(
      testSelector('action', 'open-location-selector')
    );

    andThen(() => {
      click(
        testSelector('click-target'),
        testSelector('link', 'choose-location') +
        testSelector('location', location2.id)
      );
    });
  });
});

test('Clicking "my stuff" - not signed in', function(assert) {
  mockLocationCookie(this.application);

  visit('/feed');

  click(
    testSelector('action', 'my-stuff')
  );

  andThen(()=>{
    assert.ok(
      find(testSelector('component', 'register-promo-card')).length,
      "Should see sign in form"
    );
  });
});

test('Clicking "my stuff" - signed in, no content', function(assert) {
  mockLocationCookie(this.application);
  authenticateUser(this.application);

  visit('/feed');

  click(
    testSelector('action', 'my-stuff')
  );

  andThen(()=>{
    assert.ok(
      find(testSelector('component', 'no-content-card')).length,
      "Should see sign in form"
    );
  });
});

test('hamburger menu, news filter', function(assert) {
  const done = assert.async(4);

  mockLocationCookie(this.application);

  visit('/feed');

  andThen(()=>{
    server.get('/contents', function(db, request) {
      assert.equal(request.queryParams.content_type, 'news',
        `Api endpoint called with news content_type param`
      );
      done();

      return db.feedContents.all();
    });
  });

  click(
    testSelector('toggle', 'main-nav-more')
  );

  click(
    testSelector('link', 'news-filter')
  );

  andThen(()=> {
    const $searchFilterLabel = find(
      testSelector('label', 'search-type')
    );

    assert.equal(
      $searchFilterLabel.text().trim(),
      "News",
      "Should see news filter label"
    );

    server.get('/contents', function(db, request) {
      assert.equal(request.queryParams.content_type, '',
        `Api endpoint called with no content_type param`
      );
      done();

      return db.feedContents.all();
    });

    click(
      testSelector("action", 'remove-type-filter')
    );

    andThen(()=>{

      assert.notOk(
        find(
          testSelector("component", "search-type-tag")
        ).length,
        "Clicking the X button on the filter removes the filter label"
      );
    });
  });
});

test('hamburger menu, market filter', function(assert) {
  const done = assert.async(4);
  mockLocationCookie(this.application);

  visit('/feed');

  andThen(()=>{
    server.get('/contents', function(db, request) {
      assert.equal(request.queryParams.content_type, 'market',
        `Api endpoint called with market content_type param`
      );
      done();

      return db.feedContents.all();
    });
  });

  click(
    testSelector('toggle', 'main-nav-more')
  );

  click(
    testSelector('link', 'market-filter')
  );

  andThen(()=> {
    const $searchFilterLabel = find(
      testSelector('label', 'search-type')
    );

    assert.equal(
      $searchFilterLabel.text().trim(),
      "Market",
      "Should see a Market filter label"
    );

    server.get('/contents', function(db, request) {
      assert.equal(request.queryParams.content_type, '',
        `Api endpoint called with no content_type param`
      );
      done();

      return db.feedContents.all();
    });

    click(
      testSelector("action", 'remove-type-filter')
    );

    andThen(()=>{

      assert.notOk(
        find(
          testSelector("component", "search-type-tag")
        ).length,
        "Clicking the X button on the filter removes the filter label"
      );
    });
  });
});

test('hamburger menu, events filter', function(assert) {
  mockLocationCookie(this.application);
  assert.expect(2);

  // const eventInstances = server.createList('event-instance', 3);
  server.createList('event-instance', 3);

  visit('/feed');

  click(
    testSelector('toggle', 'main-nav-more')
  );

  click(
    testSelector('link', 'event-filter')
  );

  andThen(()=> {
    const $searchFilterLabel = find(
      testSelector('label', 'search-type')
    );

    assert.equal(
      $searchFilterLabel.text().trim(),
      "Events",
      "Should see an Event filter label"
    );

    click(
      testSelector("action", 'remove-type-filter')
    );

    andThen(()=>{
      assert.notOk(
        find(
          testSelector('label', 'search-type')
        ).length,
        "Clicking the X button removes the filter label"
      );
    });
  });
});

test('visiting /feed; selected location in cookie, unauthenticated; signing in with user having different location', function(assert) {
  const visitorLocation = server.create('location');
  const userLocation = server.create('location');
  const user = server.create('user', {
    locationId: userLocation.id,
    locationConfirmed: true
  });

  this.cookies['locationId'] = visitorLocation.id;
  this.cookies['locationConfirmed'] = true;

  visit(`/feed?location=${visitorLocation.id}`);

  click(testSelector('link', 'login-link'));

  fillIn(testSelector('field', 'sign-in-email'), user.email);
  fillIn(testSelector('field', 'sign-in-password'), 'password');

  click(testSelector('component', 'sign-in-submit'));

  andThen(() => {
    assert.equal(currentURL(), `/feed?location=${userLocation.id}`,
      "Signing in: Reloads feed with user's location"
    );

    assert.equal(this.cookies['locationId'], userLocation.id,
      "Signing in: sets cookie location to user location"
    );
  });
});
