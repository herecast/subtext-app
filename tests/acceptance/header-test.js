import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';
import mockService from 'subtext-ui/tests/helpers/mock-service';
import Ember from 'ember';

moduleForAcceptance('Acceptance | header');

test('Location is displayed in header', function(assert) {
  const location = mockLocationCookie(this.application);
  const locationName = [location.city, location.state].join(', ');

  visit(`/`);

  andThen(()=>{
    const $userLocation = find(testSelector('component', 'user-location'));
    const innerText = $userLocation.text().trim();
    assert.ok(innerText.indexOf(locationName) >= 0, 'User location in header should show user specified location');
  });
});

test('Changing location from header works', function(assert) {
  const done = assert.async(3);

  const originalLocation = server.create('location');
  const newLocation = server.create('location', {
    city: 'Hanover',
    state: 'NH'
  });
  const newLocationName = [newLocation.city, newLocation.state].join(', ');

  mockService(this.application, 'cookies', Ember.Object.extend({
    read(name) {
      if (name === 'userLocationId') {
        return originalLocation.id;
      }
    },
    write(name, value){
      if (name === 'userLocationId') {
        assert.equal(value, newLocation.id, 'The cookie is set to the new chosen location');
        done();
      }
    }
  }));

  visit(`/`);

  andThen(() => {
    click(testSelector('component', 'user-location'));

    andThen(() => {
      const $userLocationSearch = find(testSelector('user-location-search'));

      assert.ok($userLocationSearch.length, 'Clicking the location in the header should show the location input box');

      let query = 'hanover';

      server.get('/locations', function(db, request) {
        if (request.queryParams.query) {
          assert.equal(request.queryParams.query, query, "The correct query made it through to the API request");
          done();
        }

        return db.locations.all();
      });

      fillIn($userLocationSearch.find('input'), query);

      andThen(() => {
        server.get('/feed', function(db, request) {
          if (request.queryParams.location_id) {
            assert.equal(request.queryParams.location_id, newLocation.id, "The new location id is passed to the api request for the feed");
            done();
          }

          return {feedItems: []};
        });

        click(testSelector('location-result', newLocation.id));

        andThen(() => {
          const innerTextInput = $userLocationSearch.find('input').val().trim();
          assert.ok(innerTextInput.indexOf(newLocationName) >= 0, 'Value in search input box in header should show user chosen location');

          click(testSelector('button', 'global-search-open-close'));

          andThen(() => {
            const $userLocation = find(testSelector('component', 'user-location'));
            const innerTextBar = $userLocation.text().trim();
            assert.ok(innerTextBar.indexOf(newLocationName) >= 0, 'User location in header should show user specified location');
          });
        });
      });
    });
  });
});

test('Opening search, searching, filtering, and closing search work from search icon', function(assert) {
  const done = assert.async(3);
  mockLocationCookie(this.application);

  visit(`/`);

  andThen(() => {
    click(testSelector('button', 'global-search-open-close'));

    andThen(() => {
      const $globalSearch = find(testSelector('global-search'));
      assert.ok($globalSearch.length > 0, 'Clicking search icon should bring up the search input box');

      let query = 'kids events';

      server.get('/feed', function(db, request) {
        if (request.queryParams.query) {
          assert.equal(request.queryParams.query, query, "The search query is passed to the api request for the feed");
          done();
        }

        return {feedItems: []};
      });

      Ember.run(() => {
        fillIn($globalSearch.find('input'), query);
      });

      andThen(() => {

        server.get('/feed', function(db, request) {
          if (request.queryParams.content_type) {
            assert.equal(request.queryParams.content_type, 'posts', "The filter button choice gets passed to the API request");
            done();
          }

          return {feedItems: []};
        });

        Ember.run(() => {
          click(testSelector('link', 'posts-filter'));
        });
        
        andThen(() => {
          server.get('/feed', function(db, request) {
            assert.ok(request.queryParams.query.length === 0, "The search query is cleared and not passed to feed after close search");
            done();
            return {feedItems: []};
          });

          click(testSelector('button', 'global-search-open-close'));
        });
      });
    });
  });

});
