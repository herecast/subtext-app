/* global FormData */
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcMarket from 'subtext-ui/tests/pages/ugc-market';

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

    const currentUser = this.server.create('current-user', {
      locationId: location.id,
      email
    });

    this.server.post('/contents', function(db) {
      const attrs = this.normalizedRequestAttrs();
      assert.deepEqual(attrs, {
        authorName: get(currentUser, 'name'),
        bizFeedPublic: true,
        contactEmail: email,
        contactPhone: phone,
        content: description,
        contentType: "market",
        cost: cost,
        costType: null,
        eventUrl: null,
        organizationId: null,
        listservIds:[],
        publishedAt: null,
        registrationDeadline: null,
        schedules: [],
        sold: false,
        subtitle: null,
        sunsetDate: null,
        title: title,
        locationId: get(location, 'id'),
        venueId: null,
        venueStatus: null,
        wantsToAdvertise:false,
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

    await ugcMarket.visit()
      .fillInTitle(title)
      .fillInDescription(description)
      .fillInCost(cost);

    await ugcMarket.addImageFile();
    await click('[data-test-add-another-image]');
    await ugcMarket.addImageFile();

    await ugcMarket.selectNewLocation(get(location, 'id'));

    await ugcMarket.fillInEmail(email)
      .fillInPhone(phone);

    await ugcMarket.next();
    await ugcMarket.next();

    ugcMarket.saveAndPublish();

  });
});
