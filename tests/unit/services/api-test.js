import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'subtext-app/config/environment';

// Browser functions required:
/* global FormData */
/* global Blob */
/* global btoa */
/* global encodeURI */


const expect = {
  contentTypeHeader(assert, request, contentType) {
    assert.ok(
      request.requestHeaders['content-type'].indexOf(contentType) > -1,
      `Has Content-Type header with ${contentType}`
    );
  },

  acceptHeader(assert, request, contentType) {
    assert.ok(
      request.requestHeaders['accept'].indexOf(contentType) > -1,
      `Has Accept header with ${contentType}`
    );
  },

  consumerAppHeader(assert, request) {
    assert.equal(
      request.requestHeaders['consumer-app-uri'],
      'http://test.test',
      "Has Consumer-App-Uri header"
    );
  },

  authorizationHeader(assert, request) {
    assert.equal(
      request.requestHeaders['authorization'],
      `Token token="1234", email="test@test.com"`,
      "Has Authorization header"
    );
  }
};

module('Unit | Service | api', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.inegration = true;

    this.session = EmberObject.create({
      isAuthenticated: true,
      getClientId() {
        return 'clientid';
      },
      data: {
        authenticated: {
          email: 'test@test.com',
          token: '1234'
        }
      }
    });

    this.queryCache = {
      retrieveFromCache() {
        return null;
      },
      cacheResponseIfFastboot(url, data) {
        return data;
      }
    };

    config['CONSUMER_APP_URI'] = 'http://test.test';
  });

  test('createRegistration(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {test: 'data'};

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/users/sign_up', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const requestData = JSON.parse(request.requestBody);
      assert.deepEqual(requestData, data,
        "POST /users/sign_up with expected data");

      return returnData;
    });

    subject.createRegistration(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('createImage(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = new FormData();
    data.append('image[primary]', true);
    data.append('image[content_id]', 1);
    data.append('image[image]', new Blob([""], {type: 'image/jpeg'}));

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/images', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      // Pretender gets in the way of this...
      //expect.contentTypeHeader(assert, request, 'multipart/form-data');

      assert.deepEqual(request.requestBody, data,
        "POST /images with expected data");

      return returnData;
    });

    subject.createImage(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('updateImage(id, data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {
      caption: 'Cat sitting in vase',
      primary: 1,
      content_id: 99
    };
    const id = 1;

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.put('/images/:id', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      assert.equal(id, request.params.id);
      const parsedJson = JSON.parse(request.requestBody);

      assert.deepEqual(parsedJson, {image: data},
        "PUT /images/:id with expected data");

      return returnData;
    });

    return subject.updateImage(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getContents(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {filter: 'data'};

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/contents', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.deepEqual(request.queryParams, data,
        "GET /contents with query params");

      return returnData;
    });

    subject.getContents(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getContentMetrics(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {query: 'data'};
    const id = 1;

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/contents/:id/metrics', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.queryParams['filter'], data['filter'],
        "GET /contents/:id/metrics with query params");

      return returnData;
    });

    subject.getContentMetrics(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getContentPromotions(options)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const content_id = 1;

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/promotions', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.ok(true, 'GET /promotions');
      assert.equal(request.queryParams['content_id'], content_id,
        "Includes content_id query param when given.");

      return returnData;
    });

    subject.getContentPromotions({content_id}).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getLocationsNear(location, radius)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const location = {id: 'cherry-hill-ct'};
    const radius = 25;

    const done = assert.async();
    const returnData = {
      locations: []
    };

    this.server.get('/locations/:id/near', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.params.id, location.id);
      assert.equal(request.queryParams['radius'], radius);

      return returnData;
    });

    subject.getLocationsNear(location, radius).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getPromotionBannerMetrics(id, data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const id = 1;
    const data = {filter: 'data'};

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/promotion_banners/:id/metrics', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.params.id, id,
        'GET /promotion_banners/:id/metrics');

      assert.deepEqual(request.queryParams, data,
        'Passed filter data through to query params');

      return returnData;
    });

    subject.getPromotionBannerMetrics(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getSimilarContent(id)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const id = 1;

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/contents/:content_id/similar_content', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.params.content_id, id,
        'GET /contents/:content_id/similar_content');

      return returnData;
    });

    subject.getSimilarContent(id).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getVenues()', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/venues', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.ok(true, 'GET /venues');

      return returnData;
    });

    subject.getVenues().then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getVenues(query)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const query = "texas";

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/venues', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.queryParams['query'], query,
        'GET /venues?query= Get with query params');

      return returnData;
    });

    subject.getVenues(query).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getVenueLocations()', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/venue_locations', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.ok(true, 'GET /venue_locations');

      return returnData;
    });

    subject.getVenueLocations().then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('getVenueLocations(query)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const query = "texas";

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.get('/venue_locations', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(request.queryParams['query'], query,
        'GET /venue_locations?query= Get with query params');

      return returnData;
    });

    subject.getVenueLocations(query).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('updateCurrentUserImage(data) | Avatar', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = new FormData();
    data.append('current_user[avatar]', new Blob([""], {type: 'image/jpeg'}));

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.put('/current_user', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      // Pretender gets in the way of this...
      //expect.contentTypeHeader(assert, request, 'multipart/form-data');

      assert.deepEqual(request.requestBody, data,
        "PUT /current_user with expected data");

      return returnData;
    });

    subject.updateCurrentUserImage(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('updateEventImage(id, data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = new FormData();
    const id = 3;

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    data.append('event[image]', new Blob([""], {type: 'image/jpeg'}));

    this.server.put('/events/:id', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      // Pretender gets in the way of this...
      //expect.contentTypeHeader(assert, request, 'multipart/form-data');

      assert.equal(request.params.id, id,
        "Updates event resource matching id");

      assert.deepEqual(request.requestBody, data,
        "PUT /events/:id with expected data");

      return returnData;
    });

    subject.updateEventImage(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });


  test('updateCurrentUserPassword(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {
      current_user: {
        password: 'hkjlk;',
        password_confirmation: 'hkjlk;'
      }
    };

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.put('/current_user', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);
      assert.deepEqual(jsonData, data,
        "PUT /current_user with expected data");

      return returnData;
    });

    subject.updateCurrentUserPassword(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('recordPromoBannerClick(id, data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const id = 7;
    const data = {
      content_id: 99
    };

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/promotion_banners/:id/track_click', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);
      assert.deepEqual(jsonData, data,
        "POST /promotion_banners/:id/track_click with expected data");

      return returnData;
    });

    subject.recordPromoBannerClick(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('recordPromoBannerImpression(id, data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const id = 7;
    const data = {
      content_id: 99
    };
    const returnText = "ok";
    const done = assert.async();

    this.server.post('/promotion_banners/:id/impression', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'text/plain');
      expect.contentTypeHeader(assert, request, 'application/json');

      assert.ok( request.requestHeaders['accept'].indexOf('text/plain') > -1,
        "Expecting text/plain content type for return");

      const jsonData = JSON.parse(request.requestBody);
      assert.deepEqual(jsonData, data,
        "POST /promotion_banners/:id/impression with expected data");

      return returnText;
    });

    subject.recordPromoBannerImpression(id, data).then((responseData) => {
      assert.deepEqual(responseData, returnText,
        'it returns response text'
      );
      done();
    });
  });

  test('recordContentImpression(id)', function(assert) {

    const subject = this.owner.factoryFor('service:api').create({session: this.session});
    const id = 7;
    const news = EmberObject.create({id: id});
    const done = assert.async();

    this.server.post('/metrics/contents/:id/impressions', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.equal(
        request.params.id, id,
        "POST /metrics/contents/:id/impressions with expected id");

      done();
      return {};
    });

    subject.recordContentImpression(news.id);
  });

  test('reportAbuse(content_id, content_type, flagType)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const content_id = 7;
    const contentType = 'comment';
    const flagType = 'MunkFruit';

    const data = {
      id: content_id,
      content_type: contentType,
      flag_type: flagType
    };

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/moderations', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);
      assert.deepEqual(jsonData, data,
        "POST /moderations with expected data");

      return returnData;
    });

    subject.reportAbuse(content_id, contentType, flagType).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('requestPasswordReset(email, returnUrl)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const email = "luigi@mario.kart";
    const returnUrl = '/castle';

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/password_resets', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);

      assert.deepEqual(jsonData, {
          return_url: returnUrl,
          user: {email: email}
        },
        "POST /password_resets with expected data");

      return returnData;
    });

    subject.requestPasswordReset(email, returnUrl).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('resendConfirmation(email)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const email = "luigi@mario.kart";

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/users/resend_confirmation', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);

      assert.deepEqual(jsonData, {
          user: {email: email}
        },
        "POST /users/resend_confirmation with expected data");

      return returnData;
    });

    subject.resendConfirmation(email).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('resetPassword(data)', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });
    const data = {
      user: {
        reset_password_token: 'Lemon',
        password: 'Peach',
        password_confirmation: 'Peach'
      }
    };

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.put('/password_resets', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');
      expect.contentTypeHeader(assert, request, 'application/json');

      const jsonData = JSON.parse(request.requestBody);
      assert.deepEqual(jsonData, data,
        "PUT /password_resets with expected data");

      return returnData;
    });

    subject.resetPassword(data).then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });

  test('signOut()', function(assert) {
    const subject = this.owner.factoryFor('service:api').create({
      session: this.session,
      queryCache: this.queryCache
    });

    const done = assert.async();
    const returnData = {
      root: {
        field: 'value'
      }
    };

    this.server.post('/users/logout', (schema, request) => {
      expect.consumerAppHeader(assert, request);
      expect.authorizationHeader(assert, request);
      expect.acceptHeader(assert, request, 'application/json');

      assert.ok(true,
        "POST /users/logout");

      return returnData;
    });

    subject.signOut().then((responseData) => {
      assert.deepEqual(responseData, returnData,
        'it returns parsed response JSON'
      );
      done();
    });
  });
});
