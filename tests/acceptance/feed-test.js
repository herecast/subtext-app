import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import mockCookies from 'subtext-ui/tests/helpers/mock-cookies';
import Ember from 'ember';
import moment from 'moment';

moduleForAcceptance('Acceptance | feed', {
  beforeEach() {
    this.cookies = {};
    mockCookies(this.application, this.cookies);

    invalidateSession(this.application);
  }
});

test('feed works when visiting index not logged in and no location cookie present (first time user)', function(assert) {
  const done = assert.async();

  const feedItems = server.createList('feedItem', 3, {
    modelType: 'content'
  });

  server.get('/feed', function({feedItems}, request) {
    if (request.queryParams.location_id) {
      const defaultLocationId = 19;
      assert.equal(request.queryParams.location_id, defaultLocationId, "The default location id is passed to the api request");
      done();
    }

    return feedItems.all();
  });

  visit('/');

  andThen(()=>{
    feedItems.forEach((record) => {
      const $feedCard = find(testSelector('feed-card') + testSelector('content', record.content.id));
      assert.ok($feedCard.length, `A feed card exists for content id: ${record.content.id}`);
    });
  });
});

test('feed works when visiting index not logged in and location is present in cookie (return anonymous user)', function(assert) {
  const done = assert.async();
  const cookieLocation = mockLocationCookie(this.application);
  const feedItems = server.createList('feedItem', 3, {
    modelType: 'content'
  });

  server.get('/feed', function({feedItems}, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, cookieLocation.id, "The location id from the cookie is passed to the api request");
      done();
    }

    return feedItems.all();
  });

  visit('/');

  andThen(()=>{
    feedItems.forEach((record) => {
      const $feedCard = find(testSelector('feed-card') + testSelector('content', record.content.id));
      assert.ok($feedCard.length, `A feed card exists for content id: ${record.content.id}`);
    });
  });
});

test('feed works when visiting index and logged in with mismatched cookie location', function(assert) {
  const done = assert.async();
  mockLocationCookie(this.application);
  const userLocation = server.create('location');
  const currentUser = server.create('current-user', {locationId: userLocation.id});

  const feedItems = server.createList('feedItem', 3, {
    modelType: 'content'
  });

  server.get('/feed', function({feedItems}, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, userLocation.id, "The logged in users location id is passed to the api request");
      done();
    }

    return feedItems.all();
  });

  authenticateUser(this.application, currentUser);

  visit('/');

  andThen(()=>{
    feedItems.forEach((record) => {
      const $feedCard = find(testSelector('feed-card') + testSelector('content', record.content.id));
      assert.ok($feedCard.length, `A feed card exists for content id: ${record.content.id}`);
    });
  });
});


test('visiting feed.show page not logged in fills the feed correctly', function(assert) {
  const done = assert.async();

  const contentLocation = server.create('location');
  const contentRecord = server.create('content', {
    locationId: contentLocation.id
  });
  server.create('feedItem', {
    modelType: 'content',
    content: contentRecord
  });

  server.get('/feed', function({feedItems}, request) {
    if (request.queryParams.location_id) {
      assert.equal(request.queryParams.location_id, contentLocation.id, "The contents location id is passed to the api request to fill feed");
      done();
    }

    return feedItems.all();
  });

  visit('/' + contentRecord.id);

  andThen(()=>{
    assert.equal(currentPath(), 'feed.show', 'it does not redirect anywhere');
  });
});


test("feed.show page, news", function(assert) {
  const contentRecord = server.create('content', {
    contentOrigin: 'ugc',
    contentType: 'news'
  });
  visit('/' + contentRecord.id);

  andThen(()=>{
    assert.equal(currentPath(), 'feed.show');

    const $newsDetail = find(
      testSelector('component', 'news-detail') +
      testSelector('content', contentRecord.id)
    );

    assert.ok($newsDetail.length, 'Displays news detail');
  });
});


test('feed.show page, market post', function(assert) {
  const contentRecord = server.create('content', {
    contentOrigin: 'ugc',
    contentType: 'market'
  });

  visit('/' + contentRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show'
    );

    const $marketDetail = find(
      testSelector('component', 'market-detail') +
      testSelector('content', contentRecord.id)
    );

    assert.ok($marketDetail.length, 'Displays market detail');
  });
});

test('feed.show page, talk - goes to market', function(assert) {
  const contentRecord = server.create('content', {
    contentOrigin: 'ugc',
    contentType: 'talk'
  });

  visit('/' + contentRecord.id);

  andThen(()=>{
    assert.equal(
      currentPath(),
      'feed.show'
    );

    const $talkDetail = find(
      testSelector('component', 'market-detail') +
      testSelector('content', contentRecord.id)
    );

    assert.ok($talkDetail.length, 'Displays talk detail as market');
  });
});

test('feed.show-instance page, event', function(assert) {
  const eventInstance = server.create('event-instance');
  const contentRecord = server.create('content', {
    contentOrigin: 'ugc',
    contentType: 'event',
    eventInstanceId: eventInstance.id
  });

  visit('/' + contentRecord.id);

  andThen(()=>{
    assert.equal(currentPath(), 'feed.show-instance', 'Shows event detail page in feed.show-instance route');

    const $eventDetail = find(testSelector('component', 'event-detail') +testSelector('content', eventInstance.contentId));

    assert.ok($eventDetail.length, 'Displays event detail in feed.show-instance route');
  });
});

test('tracking impression events fired on feed index', function(assert) {
  let impressions = 0;
  const done = assert.async(2);
  const tracking = Ember.Service.extend({
    trackTileLoad(){},
    trackTileImpression() {
      impressions = impressions+1;
      done();
    }
  });

  this.application.register('services:trackingMock', tracking);
  this.application.inject('component:feed-card', 'tracking', 'services:trackingMock');

  const content = server.create('content', {
    contentType: 'news'
  });

  const feedItem = server.create('feedItem', {
    modelType: 'content'
   });

  feedItem.content = content;
  Ember.run(() => {
    feedItem.save();
    done();
  });

  visit('/');

  andThen(()=> {
    assert.notEqual(impressions, 0,
      "Impressions were tracked on feed index page");
  });
});

test('tracking impression events fired on event feed index', function(assert) {
  let impressions = 0;
  const done = assert.async();
  const tracking = Ember.Service.extend({
    trackTileLoad(){},
    trackTileImpression() {
      impressions = impressions+1;
      done();
    }
  });

  this.application.register('services:trackingMock', tracking);
  this.application.inject('component:feed-card', 'tracking', 'services:trackingMock');

  server.create('event-instance', {
    startsAt: moment().add(1, 'day').format('YYYY-MM-DD')
  });

  visit('/?type=calendar');

  andThen(()=> {
    assert.notEqual(impressions, 0,
      "Impressions were tracked on feed index page");
  });
});

test('tracking impression events are not fired on feed detail page', function(assert) {
  const done = assert.async();
  let impressions = 0;
  const tracking = Ember.Service.extend({
    trackTileLoad(){},
    trackTileImpression() {
      impressions = impressions+1;
    }
  });

  this.application.register('services:trackingMock', tracking);
  this.application.inject('component:feed-card', 'tracking', 'services:trackingMock');

  const content = server.create('content', {
      contentType: 'news'
    });

  const feedItem = server.create('feedItem', {
    modelType: 'content'
   });

  feedItem.content = content;
  Ember.run(() => {
    feedItem.save();
    done();
  });

  visit('/' + content.id);

  andThen(()=> {
    assert.equal(impressions, 0,
      "Impressions were not tracked on feed detail page");
  });
});
