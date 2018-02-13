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
  const done = assert.async(3);
  const location = server.create('location');
  const listserv = server.create('listserv');

  const title = 'Flying the Millennium Falcon';
  const description = 'Really not that tough...';
  const email = 'han@solo.com';
  const phone = '8025555555';
  const cost = "7";

  server.post('/market_posts', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.equal(JSON.stringify(attrs), JSON.stringify({
      authorId: null,
      avatarUrl: null,
      contactEmail: email,
      contactPhone: phone,
      content: description,
      contentType: null,
      contentOrigin: null,
      cost: cost,
      costType: null,
      embeddedAd: false,
      endsAt: null,
      eventId: null,
      eventInstanceId: null,
      eventUrl: null,
      imageWidth: null,
      imageHeight: null,
      listservIds: [parseInt(get(listserv, 'id'))],
      organizationId: null,
      organizationName: null,
      organizationProfileImageUrl: null,
      organizationBizFeedActive: false,
      parentContentId: null,
      parentContentType: null,
      parentEventInstanceId: null,
      registrationDeadline: null,
      sold: false,
      startsAt: null,
      subtitle: null,
      title: title,
      ugcJob: null,
      viewCount: null,
      wantsToAdvertise:false,
      promoteRadius: 50,
      ugcBaseLocationId: get(location, 'id')
    }),
      "Server received expected POST data."
    );
    done();
    const content = server.create('content');
    return server.create('market-post', {id: content.id});
  });

  server.post('/images', function(_, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded one image');
    }
    return {};
  });

  Ember.run(() => {
    authenticateUser(this.application);

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
    ugcMarket.fillInEmail(email);
    ugcMarket.fillInPhone(phone);
    ugcMarket.next();

    ugcMarket.selectLocation(location);
    ugcMarket.pickRadius(50);
    ugcMarket.pickListserv(listserv);

    ugcMarket.next();
    ugcMarket.saveAndPublish();
  });
});