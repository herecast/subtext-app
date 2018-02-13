/* global FormData */
import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcTalk from 'subtext-ui/tests/pages/ugc-talk';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import Ember from 'ember';

const { get } = Ember;

moduleForAcceptance('Acceptance | ugc talk');

test('Every field available filled in', function(assert) {
  const done = assert.async(2);
  const location = server.create('location');
  const listserv = server.create('listserv');

  server.post('/talk', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.equal(JSON.stringify(attrs), JSON.stringify({
      authorId: null,
      avatarUrl: null,
      contactEmail: null,
      contactPhone: null,
      content: 'test-content',
      contentType: null,
      contentOrigin: null,
      cost: null,
      costType: null,
      embeddedAd: false,
      endsAt: null,
      eventId: null,
      eventInstanceId: null,
      eventUrl: null,
      hasContactInfo: false,
      listservIds: [],
      organizationId: null,
      organizationName: null,
      organizationProfileImageUrl: null,
      organizationBizFeedActive:false,
      registrationDeadline: null,
      sold: false,
      startsAt: null,
      subtitle: null,
      title: 'test-title',
      updatedAt: null,
      ugcJob: null,
      wantsToAdvertise: false,
      promoteRadius: 20,
      listservId: parseInt(get(listserv, 'id')),
      ugcBaseLocationId: get(location, 'id')
    }),
      "Server received expected POST data."
    );
    done();
    server.create('content', attrs);
    return server.create('talk', attrs);
  });

  server.put(`/talk/:id`, function(_, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return {};
  });

  Ember.run(() => {
    authenticateUser(this.application);

    ugcTalk.visit();
    ugcTalk.fillInTitle('test-title');
    ugcTalk.fillInDescription('test-content');
    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = "funnyCat.jpg";
        Ember.run(()=>{
          ugcTalk.fillInImage(file);
        });
      });
    });
    ugcTalk.next();

    ugcTalk.selectLocation(location);
    ugcTalk.pickRadius(20);
    ugcTalk.pickListserv();

    ugcTalk.next();
    ugcTalk.saveAndPublish();
  });
});
