import { run } from '@ember/runloop';
import Service from '@ember/service';
import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import moment from 'moment';
import { visit, find, currentRouteName, getContext } from '@ember/test-helpers';
import { Promise } from 'rsvp';

module('Acceptance | feed', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
  });

  skip('tracking impression events fired on feed index', async function(assert) {
    mockLocationCookie(this.server);

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

    const content = this.server.create('content', {
      contentType: 'news'
    });

    const feedItem = this.server.create('feedItem', {
      modelType: 'content'
     });

    feedItem.update({content});

    await visit('/');

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    run(() => {
      assert.notEqual(impressions, 0, "Impressions were tracked on feed index page");
    });
  });

  skip('tracking impression events fired on event feed index', async function(assert) {
    mockLocationCookie(this.server);

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

    const eventInstance = this.server.create('event-instance', {
      startsAt: moment(someDate).add(1, 'hour').toISOString()
    });

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      eventInstanceId: eventInstance.id
    });

    const feedItem = this.server.create('feedItem', {
      modelType: 'content'
     });

     feedItem.update({content});

    await visit(`/?type=calendar&startDate=${someDate}`);

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    run(() => {
      assert.notEqual(impressions, 0, "Impressions were tracked on feed index page");
    });

  });

  skip('tracking impression events are not fired on feed detail page', async function(assert) {
    mockLocationCookie(this.server);

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

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    assert.equal(impressions, 0, "Impressions were not tracked on feed detail page");
  });

  test('visiting feed.show page not logged in with no location cookie allows view', async function(assert) {
    mockCookies({});
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
      '[data-test-component="detail-page"]' +
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
      '[data-test-component="detail-page"]' +
      `[data-test-content="${contentRecord.id}"]`
    );

    assert.ok($marketDetail, 'Displays market detail');
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

    const $eventDetail = find('[data-test-component="detail-page"]' +`[data-test-content="${contentRecord.id}"]`);

    assert.ok($eventDetail, 'Displays event detail in feed.show-instance route');
  });
});
