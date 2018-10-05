/* global FormData */
import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcMarket from 'subtext-ui/tests/pages/ugc-market';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import Ember from 'ember';

const { get } = Ember;

moduleForAcceptance('Acceptance | ugc market post');

test('Every field available filled in', function(assert) {
  const done = assert.async(4);
  const location = server.create('location');

  const title = 'Flying the Millennium Falcon';
  const description = 'Really not that tough...';
  const email = 'han@solo.com';
  const phone = '8025555555';
  const cost = "7";

  const currentUser = server.create('current-user', {
    locationId: location.id,
    email
  });

  server.post('/contents', function() {
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
    return server.create('content', attrs);
  });

  server.post('/images', function({images}, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded one image');
    }
    return images.create();
  });

  server.get('/locations', function({locations}, request) {
    if ('query' in request.queryParams) {
      assert.ok(true, 'query sent to locations endpoint');
      done();
    }

    return locations.all();
  });

  Ember.run(() => {
    authenticateUser(this.application, currentUser);

    ugcMarket.visit();
    ugcMarket.fillInTitle(title);
    ugcMarket.fillInDescription(description);
    ugcMarket.fillInCost(cost);
    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = 'vaderInCloak.jpg';
        Ember.run(()=>{
          ugcMarket.fillInImage(file);
        });
      });
    });
    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = 'vaderWithLightSaber.jpg';
        Ember.run(()=>{
          ugcMarket.fillInSecondImage(file);
        });
      });
    });
    ugcMarket.selectNewLocation(get(location, 'id'));

    ugcMarket.fillInEmail(email);
    ugcMarket.fillInPhone(phone);
    ugcMarket.next();
    ugcMarket.next();

    ugcMarket.saveAndPublish();
  });
});
