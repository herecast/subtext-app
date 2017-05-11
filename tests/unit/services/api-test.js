import { moduleFor, test } from 'ember-qunit';
import { startMirage } from 'subtext-ui/initializers/ember-cli-mirage';
import config from 'subtext-ui/config/environment';
import Ember from 'ember';

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
      "Token token=1234",
      "Has Authorization header"
    );
  }
};

moduleFor('service:api', 'Unit | Service | api', {
  inegration: true,
  beforeEach() {
    this.server = startMirage();
    this.session = Ember.Object.create({
      isAuthenticated: true,
      authorize(name, callback) {
        callback('Authorization', 'Token token=1234');
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
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('confirmListservPost(id, data)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const id = 1;
  const data = {
    listserv_content: {
      id: id
    }
  };

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.patch('/listserv_contents/:id', (schema, request)=> {
    const requestData = JSON.parse(request.requestBody);

    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    assert.equal(request.params.id, id);
    assert.deepEqual(requestData, data);
    assert.ok(true,
      `PATCH /listserv_contents/${id} to server with correct data.`);

    return returnData;
  });

  subject.confirmListservPost(id, data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('confirmListservSubscription(id)', function(assert) {
  const subject = this.subject({
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

  server.patch('/subscriptions/:id/confirm', (schema, request)=> {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.params.id, id,
      'PATCH /subscriptions/:id/confirm with correct id');
    return returnData;
  });

  subject.confirmListservSubscription(id).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('unsubscribeSubscription(id)', function(assert) {
  const subject = this.subject({
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

  server.del('/subscriptions/:id', (schema, request)=> {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.params.id, id,
      'DELETE /subscriptions/:id with correct id');
    return returnData;
  });

  subject.unsubscribeSubscription(id).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('unsubscribeFromListserv(id, email)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const id = 1;
  const email = 'test@foo.com';

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.del('/subscriptions/:id/:encoded_email', (schema, request)=> {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    const encodedEmail = encodeURIComponent(btoa(email));

    assert.equal(request.params.id, id);
    assert.equal(request.params.encoded_email, encodedEmail);
    assert.ok(true, 'DELETE /subscriptions/:id/:encoded_email with correct id and email');
    return returnData;
  });

  subject.unsubscribeFromListserv(id, email).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('confirmedRegistration(data)', function(assert) {
  const subject = this.subject({
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

  server.post('/registrations/confirmed', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    const requestData = JSON.parse(request.requestBody);
    assert.deepEqual(requestData, data,
      "POST /registrations/confirmed with expected data");

    return returnData;
  });

  subject.confirmedRegistration(data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('createRegistration(data)', function(assert) {
  const subject = this.subject({
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

  server.post('/users/sign_up', (schema, request) => {
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

test('confirmedRegistration(data)', function(assert) {
  const subject = this.subject({
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

  server.post('/registrations/confirmed', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    const requestData = JSON.parse(request.requestBody);
    assert.deepEqual(requestData, data,
      "POST /registrations/confirmed with expected data");

    return returnData;
  });

  subject.confirmedRegistration(data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('createFeedback(id, data)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const data = {test: 'data'};
  const id = 1;

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.post('/businesses/:id/feedback', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    assert.equal(id, request.params.id);

    const requestData = JSON.parse(request.requestBody);
    assert.deepEqual(requestData, data,
      "POST /businesses/:id/feedback with expected data");

    return returnData;
  });

  subject.createFeedback(id, data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('updateFeedback(id, data)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const data = {test: 'data'};
  const id = 1;

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.put('/businesses/:id/feedback', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    assert.equal(id, request.params.id);

    const requestData = JSON.parse(request.requestBody);
    assert.deepEqual(requestData, data,
      "POST /businesses/:id/feedback with expected data");

    return returnData;
  });

  subject.updateFeedback(id, data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('createImage(data)', function(assert) {
  const subject = this.subject({
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

  server.post('/images', (schema, request) => {
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
  const subject = this.subject({
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

  server.put('/images/:id', (schema, request) => {
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

test('getDashboard(data)', function(assert) {
  const subject = this.subject({
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

  server.get('/dashboard', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.deepEqual(request.queryParams, data,
      "GET /dashboard with query params");

    return returnData;
  });

  subject.getDashboard(data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getContents(data)', function(assert) {
  const subject = this.subject({
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

  server.get('/contents', (schema, request) => {
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
  const subject = this.subject({
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

  server.get('/contents/:id/metrics', (schema, request) => {
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
  const subject = this.subject({
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

  server.get('/promotions', (schema, request) => {
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

test('getListServs()', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/listservs', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.ok(true, 'GET /listservs');

    return returnData;
  });

  subject.getListServs().then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getLocations()', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/locations', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.ok(true, 'GET /locations');

    return returnData;
  });

  subject.getLocations().then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getLocations(query)', function(assert) {
  const subject = this.subject({
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

  server.get('/locations', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.queryParams['query'], query,
      'GET /locations?query= Get with query params');

    return returnData;
  });

  subject.getLocations(query).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getFeatures()', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/features', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.ok(true, 'GET /features');

    return returnData;
  });

  subject.getFeatures().then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getMarketConttactInfo(id)', function(assert) {
  const subject = this.subject({
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

  server.get('/market_posts/:id/contact', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.params.id, id,
      'GET /market_posts/:id/contact');

    return returnData;
  });

  subject.getMarketContactInfo(id).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getOrganizations()', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/organizations', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.ok(true, 'GET /organizations');

    return returnData;
  });

  subject.getOrganizations().then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getOrganizations(query)', function(assert) {
  const subject = this.subject({
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

  server.get('/organizations', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.queryParams['query'], query,
      'GET /organizations?query= Get with query params');

    return returnData;
  });

  subject.getOrganizations(query).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('getPromotionBannerMetrics(id, data)', function(assert) {
  const subject = this.subject({
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

  server.get('/promotion_banners/:id/metrics', (schema, request) => {
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
  const subject = this.subject({
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

  server.get('/contents/:content_id/similar_content', (schema, request) => {
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
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/venues', (schema, request) => {
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
  const subject = this.subject({
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

  server.get('/venues', (schema, request) => {
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
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/venue_locations', (schema, request) => {
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
  const subject = this.subject({
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

  server.get('/venue_locations', (schema, request) => {
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

test('getWeather()', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnHtml = "<p>It's cold.. Very cold.</p>";

  server.get('/weather', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'text/html');

    assert.ok(true, 'GET /weather');

    return returnHtml;
  });

  subject.getWeather().then((responseHtml) => {
    assert.deepEqual(responseHtml, returnHtml,
      'it returns response HTML'
    );
    done();
  });
});

test('isRegisteredUser(email)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const email = 'Jeve.Stobs@Pear.com';
  const encodedEmail = encodeURI(email);

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.get('/user', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(request.queryParams.email, encodedEmail,
      "GET /user?email=EMAIL");

    return returnData;
  });

  subject.isRegisteredUser(email).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('updateCurrentUserAvatar(data)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const data = new FormData();
  data.append('current_user[user_id]', 1);
  data.append('current_user[image]', new Blob([""], {type: 'image/jpeg'}));

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.put('/current_user', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    // Pretender gets in the way of this...
    //expect.contentTypeHeader(assert, request, 'multipart/form-data');

    assert.deepEqual(request.requestBody, data,
      "PUT /current_user with expected data");

    return returnData;
  });

  subject.updateCurrentUserAvatar(data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('updateEventImage(id, data)', function(assert) {
  const subject = this.subject({
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

  server.put('/events/:id', (schema, request) => {
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

test('updateOrganizationImage(id, data)', function(assert) {
  const subject = this.subject({
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

  data.append('organization[image]', new Blob([""], {type: 'image/jpeg'}));

  server.put('/organizations/:id', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    // Pretender gets in the way of this...
    //expect.contentTypeHeader(assert, request, 'multipart/form-data');

    assert.equal(request.params.id, id,
      "Updates organization resource matching id");

    assert.deepEqual(request.requestBody, data,
      "PUT /organizations/:id with expected data");

    return returnData;
  });

  subject.updateOrganizationImage(id, data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('updateTalkImage(id, data)', function(assert) {
  const subject = this.subject({
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

  data.append('talk[image]', new Blob([""], {type: 'image/jpeg'}));

  server.put('/talk/:id', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    // Pretender gets in the way of this...
    //expect.contentTypeHeader(assert, request, 'multipart/form-data');

    assert.equal(request.params.id, id,
      "Updates talk resource matching id");

    assert.deepEqual(request.requestBody, data,
      "PUT /talk/:id with expected data");

    return returnData;
  });

  subject.updateTalkImage(id, data).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('updateCurrentUserPassword(data)', function(assert) {
  const subject = this.subject({
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

  server.put('/current_user', (schema, request) => {
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
  const subject = this.subject({
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

  server.post('/promotion_banners/:id/track_click', (schema, request) => {
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
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const id = 7;
  const data = {
    content_id: 99
  };
  const returnText = "ok";
  const done = assert.async();

  server.post('/promotion_banners/:id/impression', (schema, request) => {
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

test('recordNewsImpression(id)', function(assert) {

  const subject = this.subject({session: this.session});
  const id = 7;
  const news = Ember.Object.create({id: id});
  const done = assert.async();

  server.post('/news/:id/impressions', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(
      request.params.id, id,
      "POST /news/:id/impressions with expected id");

    done();
    return {};
  });

  subject.recordNewsImpression(news);
});

test('recordEventImpression(id)', function(assert) {

  const subject = this.subject({session: this.session});
  const id = 14;
  const done = assert.async();

  server.post('/events/:id/impressions', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    assert.equal(
      request.params.id, id,
      "POST /events/:id/impressions with expected id"
    );

    done();
    return {};
  });

  subject.recordEventImpression(id);
});

test('reportAbuse(content_id, flagType)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const content_id = 7;
  const flagType = 'MunkFruit';

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.post('/contents/:id/moderate', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    const jsonData = JSON.parse(request.requestBody);
    assert.equal(jsonData['flag_type'], flagType,
      "POST /contents/:id/moderate with expected data");

    return returnData;
  });

  subject.reportAbuse(content_id, flagType).then((responseData) => {
    assert.deepEqual(responseData, returnData,
      'it returns parsed response JSON'
    );
    done();
  });
});

test('requestPasswordReset(email, returnUrl)', function(assert) {
  const subject = this.subject({
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

  server.post('/password_resets', (schema, request) => {
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
  const subject = this.subject({
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

  server.post('/users/resend_confirmation', (schema, request) => {
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

test('sendEmailSignInLink(email)', function(assert) {
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });
  const email = "luigi@mario.kart";

  const done = assert.async();

  server.post('/users/email_signin_link', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');
    expect.contentTypeHeader(assert, request, 'application/json');

    const jsonData = JSON.parse(request.requestBody);

    assert.deepEqual(jsonData, {
        email: email
      },
      "POST /users/email_siginin_link with expected data");

    done();
    return {};
  });

  subject.sendEmailSignInLink(email);
});

test('resetPassword(data)', function(assert) {
  const subject = this.subject({
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

  server.put('/password_resets', (schema, request) => {
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
  const subject = this.subject({
    session: this.session,
    queryCache: this.queryCache
  });

  const done = assert.async();
  const returnData = {
    root: {
      field: 'value'
    }
  };

  server.post('/users/logout', (schema, request) => {
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

test('signInWithToken', function(assert) {

  const subject = this.subject({session: this.session});
  const token = 'hjkljklasdf';
  const done = assert.async();

  server.post('/users/sign_in_with_token', (schema, request) => {
    expect.consumerAppHeader(assert, request);
    expect.authorizationHeader(assert, request);
    expect.acceptHeader(assert, request, 'application/json');

    const data = JSON.parse(request.requestBody);
    assert.equal(
      data.token, token,
      "POST /users/sign_in_with_token with expected token in json body");

    done();
    return {};
  });

  subject.signInWithToken(token);
});
