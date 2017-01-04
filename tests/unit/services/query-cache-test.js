import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const { RSVP } = Ember;

moduleFor('service:query-cache', 'Unit | Service | query cache', {
  // Specify the other units that are required for this test.
  //needs: ['service:api']
});

test('cacheResponseIfFastboot(url, response) - not fastboot mode', function(assert) {
  const url = "/test.test";
  const shoebox = {};
  const fastboot = Ember.Object.create({
    isFastBoot: false,
    shoebox: {
      retrieve(key) {
        return shoebox[key];
      },
      put(key, data) {
        shoebox[key] = data;
      }
    }
  });
  const subject = this.subject({
    fastboot: fastboot,
    cacheTimeout: false
  });
  const data = {test: 'this'};
  const response = RSVP.resolve(data);
  const returned = subject.cacheResponseIfFastboot(url, response);
  const done = assert.async();

  returned.then((d) => {
    assert.deepEqual(
      d,
      data,
      "it returns the passed response promise with the passed data"
    );

    assert.deepEqual(
      shoebox,
      {},
      "it does not write anything to the shoebox"
    );

    done();
  });
});

test('cacheResponseIfFastboot(url, response) - fastboot mode', function(assert) {
  const url = "/test.test";
  const fbRequestPath = "/fastboot/path";
  const shoebox = {};
  const deferredPromises = [];
  const fastboot = Ember.Object.create({
    isFastBoot: true,
    request: {path: fbRequestPath},
    deferRendering(promise){
      deferredPromises.push(promise);
    },
    shoebox: {
      retrieve(key) {
        return shoebox[key];
      },
      put(key, data) {
        shoebox[key] = data;
      }
    }
  });
  const subject = this.subject({
    fastboot: fastboot,
    cacheTimeout: false
  });
  const data = {test: 'this'};
  const response = RSVP.resolve(data);
  const returned = subject.cacheResponseIfFastboot(url, response);
  const done = assert.async();

  returned.then((d) => {
    assert.deepEqual(
      d,
      data,
      "it returns the passed response promise with the expected data"
    );
    assert.deepEqual(
      shoebox['apiCache'][fbRequestPath][url],
      data,
      "it writes the data to the shoebox apiCache"
    );
    assert.ok(deferredPromises.indexOf(response) > -1,
      "it tells fastboot to wait for the response promise"
    );
    assert.deepEqual(shoebox['fastboot-request'], {path: fbRequestPath},
      "it ensures the fastboot request path is stored in the shoebox"
    );

    done();
  });
});

test('retrieveFromCache(url) - fastboot mode', function(assert) {
  const url = "/test.test";
  const fbRequestPath = "/fastboot/path";
  const data = {test: "this"};
  const shoebox = {
    'fastboot-request': {
      path: fbRequestPath
    },
    apiCache: {}
  };
  shoebox['apiCache'][fbRequestPath] = {};
  shoebox['apiCache'][fbRequestPath][url] = data;

  const fastboot = Ember.Object.create({
    isFastBoot: true,
    request: {path: fbRequestPath},
    shoebox: {
      retrieve(key) {
        return shoebox[key];
      }
    }
  });

  const subject = this.subject({
    fastboot: fastboot,
    cacheTimeout: false
  });

  assert.equal(
    subject.retrieveFromCache(url),
    null,
    "It returns null; not data out of the shoebox cache."
  );
});

test('retrieveFromCache(url) - non fastboot mode, matching data in shoebox, matching path', function(assert) {
  const url = "/test.test";
  const fbRequestPath = "/fastboot/path";
  const windowPath = "/fastboot/path";
  const data = {test: "this"};
  const shoebox = {
    'fastboot-request': {
      path: fbRequestPath
    },
    apiCache: {}
  };
  shoebox['apiCache'][fbRequestPath] = {};
  shoebox['apiCache'][fbRequestPath][url] = data;

  const fastboot = Ember.Object.create({
    isFastBoot: false,
    request: {path: fbRequestPath},
    shoebox: {
      retrieve(key) {
        return shoebox[key];
      }
    }
  });

  const subject = this.subject({
    fastboot: fastboot,
    windowLocation: {
      pathname() {
        return windowPath;
      },
      search(){ return ""; }
    },
    cacheTimeout: false
  });

  assert.deepEqual(
    subject.retrieveFromCache(url),
    data,
    "It returns data out of the shoebox cache."
  );
});

test('retrieveFromCache(url) - non fastboot mode, matching data in shoebox, non matching path', function(assert) {
  const url = "/test.test";
  const fbRequestPath = "/fastboot/path";
  const windowPath = "/window/path";
  const data = {test: "this"};
  const shoebox = {
    'fastboot-request': {
      path: fbRequestPath
    },
    apiCache: {}
  };
  shoebox['apiCache'][fbRequestPath] = {};
  shoebox['apiCache'][fbRequestPath][url] = data;

  const fastboot = Ember.Object.create({
    isFastBoot: false,
    request: {path: fbRequestPath},
    shoebox: {
      retrieve(key) {
        return shoebox[key];
      }
    }
  });

  const subject = this.subject({
    fastboot: fastboot,
    windowLocation: {
      pathname() {
        return windowPath;
      },
      search(){ return ""; }
    },
    cacheTimeout: false
  });

  assert.equal(
    subject.retrieveFromCache(url),
    null,
    "It returns null."
  );
});
