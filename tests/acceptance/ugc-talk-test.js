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
  const user = server.create('user');

  server.post('/contents', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.deepEqual(attrs, {
      authorName: user.name,
      contactEmail: null,
      contactPhone: null,
      content: 'test-content',
      contentType: 'talk',
      cost: null,
      costType: null,
      eventUrl: null,
      listservIds: [parseInt(get(listserv, 'id'))],
      organizationId: null,
      promoteRadius: 20,
      publishedAt: null,
      registrationDeadline: null,
      schedules: [],
      sold: false,
      subtitle: null,
      sunsetDate: null,
      title: 'test-title',
      ugcBaseLocationId: get(location, 'id'),
      ugcJob: null,
      venueId: null,
      venueStatus: null,
      wantsToAdvertise:false,
    },
      "Server received expected POST data."
    );
    done();
    return server.create('content', attrs);
  });

  server.post(`/images`, function({images}, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return images.create();
  });

  Ember.run(() => {
    authenticateUser(this.application, user);

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
