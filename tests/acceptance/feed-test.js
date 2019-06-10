import { run } from '@ember/runloop';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import moment from 'moment';
import { visit, find, currentRouteName, getContext } from '@ember/test-helpers';

module('Acceptance | feed', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.cookies = {};
    mockCookies(this.cookies);

    invalidateSession();
  });


  test('tracking impression events fired on feed index', async function(assert) {
    let impressions = 0;
    const done = assert.async(2);
    const tracking = Service.extend({
      trackTileLoad(){},
      trackTileImpression() {
        impressions = impressions+1;
        done();
      }
    });

    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card', 'tracking', 'services:trackingMock');

    const content = this.server.create('content', {
      contentType: 'news'
    });

    const feedItem = this.server.create('feedItem', {
      modelType: 'content'
     });

    feedItem.content = content;
    run(() => {
      feedItem.save();
      done();
    });

    await visit('/');

    run(() => {
      assert.notEqual(impressions, 0, "Impressions were tracked on feed index page");
    });
  });

  test('tracking impression events fired on event feed index', async function(assert) {
    let impressions = 0;
    const done = assert.async();
    const tracking = Service.extend({
      trackTileLoad(){},
      trackTileImpression() {
        impressions = impressions+1;
        done();
      }
    });

    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card', 'tracking', 'services:trackingMock');

    const someDate = moment().add(1, 'day').format('YYYY-MM-DD');

    this.server.create('event-instance', {
        startsAt: moment(someDate).add(1, 'hour').toISOString(),
      });

    await visit(`/?type=calendar&startDate=${someDate}`);

    run(() => {
      assert.notEqual(impressions, 0, "Impressions were tracked on feed index page");
    });

  });

  test('tracking impression events are not fired on feed detail page', async function(assert) {
    let impressions = 0;
    const tracking = Service.extend({
      trackTileLoad(){},
      trackTileImpression() {
        impressions = impressions+1;
      }
    });

    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card', 'tracking', 'services:trackingMock');

    const content = this.server.create('content', {
        contentType: 'news'
      });

    const feedItem = this.server.create('feedItem', {
      modelType: 'content'
     });

    feedItem.update({ content });

    await visit('/' + content.id);

    assert.equal(impressions, 0, "Impressions were not tracked on feed detail page");
  });

  test('feed works when visiting index not logged in and no location cookie present (first time user)', async function(assert) {
    const done = assert.async();

    const feedItems = this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        const defaultLocationId = 19;
        assert.equal(request.queryParams.location_id, defaultLocationId, "The default location id is passed to the api request");
        done();
      }

      return feedItems.all();
    });

    await visit('/');

    feedItems.forEach((record) => {
      const $feedCard = find('[data-test-feed-card]' + `[data-test-content="${record.content.id}"]`);
      assert.ok($feedCard, `A feed card exists for content id: ${record.content.id}`);
    });
  });

  test('feed works when visiting index not logged in and location is present in cookie (return anonymous user)', async function(assert) {
    const done = assert.async();
    const cookieLocation = mockLocationCookie(this.server);
    const feedItems = this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, cookieLocation.id, "The location id from the cookie is passed to the api request");
        done();
      }

      return feedItems.all();
    });

    await visit('/');

    feedItems.forEach((record) => {
      const $feedCard = find('[data-test-feed-card]' + `[data-test-content="${record.content.id}"]`);
      assert.ok($feedCard, `A feed card exists for content id: ${record.content.id}`);
    });
  });

  test('feed works when visiting index and logged in with mismatched cookie location', async function(assert) {
    const done = assert.async();
    mockLocationCookie(this.server);
    const userLocation = this.server.create('location');
    const currentUser = this.server.create('current-user', {locationId: userLocation.id});

    const feedItems = this.server.createList('feedItem', 3, {
      modelType: 'content'
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, userLocation.id, "The logged in users location id is passed to the api request");
        done();
      }

      return feedItems.all();
    });

    authenticateUser(this.server, currentUser);

    await visit('/');

    feedItems.forEach((record) => {
      const $feedCard = find('[data-test-feed-card]' + `[data-test-content="${record.content.id}"]`);
      assert.ok($feedCard, `A feed card exists for content id: ${record.content.id}`);
    });
  });

  test('visiting feed.show page not logged in fills the feed correctly', async function(assert) {
    const done = assert.async();

    const contentLocation = this.server.create('location');
    const contentRecord = this.server.create('content', {
      locationId: contentLocation.id
    });
    this.server.create('feedItem', {
      modelType: 'content',
      content: contentRecord
    });

    this.server.get('/feed', function({feedItems}, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, contentLocation.id, "The contents location id is passed to the api request to fill feed");
        done();
      }

      return feedItems.all();
    });

    await visit('/' + contentRecord.id);

    assert.equal(currentRouteName(), 'feed.show', 'it does not redirect anywhere');
  });

  test("feed.show page, news", async function(assert) {
    const contentRecord = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news'
    });
    await visit('/' + contentRecord.id);

    assert.equal(currentRouteName(), 'feed.show');

    const $newsDetail = find(
      '[data-test-component="news-detail"]' +
      `[data-test-content="${contentRecord.id}"]`
    );

    assert.ok($newsDetail, 'Displays news detail');
  });

  test('feed.show page, market post', async function(assert) {
    const contentRecord = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market'
    });

    await visit('/' + contentRecord.id);

    assert.equal(
      currentRouteName(),
      'feed.show'
    );

    const $marketDetail = find(
      '[data-test-component="market-detail"]' +
      `[data-test-content="${contentRecord.id}"]`
    );

    assert.ok($marketDetail, 'Displays market detail');
  });

  test('feed.show page, talk - goes to market', async function(assert) {
    const contentRecord = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'talk'
    });

    await visit('/' + contentRecord.id);

    assert.equal(
      currentRouteName(),
      'feed.show'
    );

    const $talkDetail = find(
      '[data-test-component="market-detail"]' +
      `[data-test-content="${contentRecord.id}"]`
    );

    assert.ok($talkDetail, 'Displays talk detail as market');
  });

  test('feed.show-instance page, event', async function(assert) {
    const eventInstance = this.server.create('event-instance');
    const contentRecord = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      eventInstanceId: eventInstance.id
    });

    await visit('/' + contentRecord.id);

    assert.equal(currentRouteName(), 'feed.show-instance', 'Shows event detail page in feed.show-instance route');

    const $eventDetail = find('[data-test-component="event-detail"]' +`[data-test-content="${eventInstance.contentId}"]`);

    assert.ok($eventDetail, 'Displays event detail in feed.show-instance route');
  });
});
