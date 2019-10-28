/* global FormData */
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import ugcMarket from 'subtext-app/tests/pages/ugc-market';

module('Acceptance | ugc market post', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Every field available filled in', async function(assert) {
    const done = assert.async(4);
    const location = this.server.create('location');

    const title = 'Flying the Millennium Falcon';
    const description = 'Really not that tough...';
    const email = 'han@solo.com';
    const phone = '8025555555';
    const cost = "7";
    const url = "http://asdf.com";

    const currentUser = this.server.create('current-user', {
      locationId: location.id,
      email
    });

    this.server.post('/contents', function(db) {
      const attrs = this.normalizedRequestAttrs();
      assert.deepEqual(attrs, {
        contactEmail: email,
        contactPhone: phone,
        content: description,
        contentType: "market",
        cost: cost,
        eventUrl: null,
        publishedAt: null,
        schedules: [],
        sold: false,
        subtitle: null,
        title: title,
        locationId: get(location, 'id'),
        url: url,
        venueId: null,
        venueStatus: null
      },
        "Server received expected POST data."
      );
      done();
      return db.create('content', attrs);
    });

    this.server.post('/images', function({images}, request) {
      if(request.requestBody.constructor === FormData) {
        done();
        assert.ok(true, 'Uploaded one image');
      }
      return images.create();
    });

    this.server.get('/locations', function({locations}, request) {
      if ('query' in request.queryParams) {
        assert.ok(true, 'query sent to locations endpoint');
        done();
      }

      return locations.all();
    });

    authenticateUser(this.server, currentUser);

    await ugcMarket.start();

    await ugcMarket.fillInTitle(title)
      .fillInDescription(description)
      .fillInCost(cost)
      .fillInEmail(email)
      .fillInPhone(phone)
      .fillInUrl(url);

    await ugcMarket.addImageFile();
    await click('[data-test-jobs-action="add-another-image"]');
    await ugcMarket.addImageFile();

    await ugcMarket.selectNewLocation(get(location, 'id'));

    await ugcMarket.fillInEmail(email)
      .fillInPhone(phone)
      .fillInUrl(url);

    await ugcMarket.preview();
    ugcMarket.launch();
  });
});
