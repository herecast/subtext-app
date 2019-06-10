import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import mockService from 'subtext-app/tests/helpers/mock-service';
import { visit, click, focus, find, fillIn } from '@ember/test-helpers';

module('Acceptance | header', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Location is displayed in header', async function(assert) {
    const location = mockLocationCookie(this.server);
    const locationName = [location.city, location.state].join(', ');

    await visit(`/`);

    const $userLocation = $(find('[data-test-component="user-location"]'));
    const innerText = $userLocation.text().trim();
    assert.ok(innerText.indexOf(locationName) >= 0, 'User location in header should show user specified location');
  });

  test('Changing location from header works', async function(assert) {
    const done = assert.async(3);

    const originalLocation = this.server.create('location');
    const newLocation = this.server.create('location', {
      city: 'Hanover',
      state: 'NH'
    });
    const newLocationName = [newLocation.city, newLocation.state].join(', ');

    mockService('cookies',{
      read: (name) => {
        if (name === 'userLocationId') {
          return originalLocation.id;
        }
      },
      write: (name, value) => {
        if (name === 'userLocationId') {
          assert.equal(value, newLocation.id, 'The cookie is set to the new chosen location');
          done();
        }
      }
    });

    await visit(`/`);

    await click('[data-test-component="user-location"]');

    const $userLocationSearch = $('[data-test-user-location-search]');

    assert.ok($userLocationSearch, 'Clicking the location in the header should show the location input box');

    let query = 'hanover';

    this.server.get('/locations', function(db, request) {
      if (request.queryParams.query) {
        assert.equal(request.queryParams.query, query, "The correct query made it through to the API request");
        done();
      }

      return db.locations.all();
    });

    await focus($userLocationSearch.find('input')[0]);
    await fillIn($userLocationSearch.find('input')[0], query);

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.location_id) {
        assert.equal(request.queryParams.location_id, newLocation.id, "The new location id is passed to the api request for the feed");
        done();
      }

      return {feedItems: []};
    });

    await click(`[data-test-location-result="${newLocation.id}"]`);

    const innerTextInput = $userLocationSearch.find('input').val().trim();
    assert.ok(innerTextInput.indexOf(newLocationName) >= 0, 'Value in search input box in header should show user chosen location');

    await click('[data-test-button="global-search-open-close"]');

    const $userLocation = $(find('[data-test-component="user-location"]'));
    const innerTextBar = $userLocation.text().trim();
    assert.ok(innerTextBar.indexOf(newLocationName) >= 0, 'User location in header should show user specified location');
  });

  test('Opening search, searching, filtering, and closing search work from search icon', async function(assert) {
    const done = assert.async(2);
    mockLocationCookie(this.server);

    await visit(`/`);

    await click('[data-test-button="global-search-open-close"]');

    const $globalSearch = $(find('[data-test-global-search]'));
    assert.ok($globalSearch, 'Clicking search icon should bring up the search input box');

    let query = 'kids events';

    this.server.get('/feed', function(db, request) {
      if (request.queryParams.query) {
        assert.equal(request.queryParams.query, query, "The search query is passed to the api request for the feed");
        done();
      }

      return {feedItems: []};
    });

    await fillIn($globalSearch.find('input')[0], query);

    this.server.get('/feed', function(db, request) {
      assert.ok(request.queryParams.query.length === 0, "The search query is cleared and not passed to feed after close search");
      done();
      return {feedItems: []};
    });

    await click('[data-test-button="global-search-open-close"]');
  });
});
