/* global sinon */
import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';

window.Intercom = sinon.stub();

let doNotTrack = sinon.stub();
let doTrack = sinon.stub();

let intercom = Ember.Service.extend({
  doNotTrack: doNotTrack,
  doTrack: doTrack,
  update: sinon.stub(),
  boot: sinon.stub()
});


// for disabling reload after signin/signout
let windowLocationMock = Ember.Service.extend({
  reload() {
    // do nothing
  },
  href() {
    return "";
  }
});

let infoSpy = sinon.spy();

let notificationsMock = Ember.Service.extend({
  info: infoSpy
});

const Workflow = {
  signIn() {
    fillIn(testSelector('field', 'sign-in-form-password'), "password");
    click(testSelector('action', 'sign-in-form-submit'));
  },
  register() {

    fillIn(testSelector('field', 'registration-form-name'), 'Edgar Poe');
    fillIn(testSelector('field', 'registration-form-password'), 'ravenPerch');

    andThen(() => {
      let $locationSelect = find(testSelector('component', 'registration-form-location')).find('select');
      $locationSelect.val($locationSelect.find('option:last').val());
      $locationSelect.change();
    });

    click(testSelector('action', 'registration-form-submit'));
  },
  selectChannel(channel) {
    click(testSelector('select-channel', channel));
    this.next();
  },
  next() {
    click(testSelector('action', 'next-step'));
  },
  fillInTalkForm(data) {
    fillIn(
      testSelector('field', 'talk-title'),
      data['title']
    );

    this.next();
  },
  fillInMarketForm(data) {
    fillIn(
      testSelector('field', 'market-title'),
      data['title']
    );

    fillIn(
      testSelector('field', 'market-price'),
      data['price']
    );

    fillIn(
      testSelector('field', 'market-contactPhone'),
      data['contactPhone']
    );
 
    fillIn(
      testSelector('field', 'market-contactEmail'),
      data['contactEmail']
    );

    this.next();
 }
};

moduleForAcceptance('Acceptance | enhance listserv post workflows', {
  beforeEach: function() {

    this.application.register('service:intercomTest', intercom);
    this.application.inject('route', 'intercom', 'service:intercomTest');

    this.application.register('service:windowMock', windowLocationMock);
    this.application.inject('route:application', 'windowLocation', 'service:windowMock');

    this.application.register('service:notification-messages', notificationsMock);

    invalidateSession(this.application);

    this.trackingEvents = [];

    server.patch('listserv_contents/:id/update_metric', (s, {params, requestBody}) => {
      this.trackingEvents.push({
        id: params.id,
        data: JSON.parse(requestBody)
      });
      return {};
    });
  }
});

test('Poster has account, not signed in', function(assert) {
  const user = server.create('user');
  const post = server.create('listservContent', {
    user: user
  });

  visit(`/lists/posts/${post.id}`);
  andThen(() => {
    assert.ok(find(testSelector('component', 'listserv-sign-in-form')).length,
      "Should see sign in form"
    );

    const lastEvent = this.trackingEvents.pop();
    assert.deepEqual(lastEvent, {
      id: post.id,
      data: {
        enhance_link_clicked: true,
        step_reached: 'user_sign_in'
      }
    }, "Event tracked for sign in step");

    Workflow.signIn();

    andThen(() => {
      assert.ok(find(testSelector('component', 'channel-selector')).length,
        "Should see channel selector"
      );
      assert.ok(find(testSelector('component', 'listserv-sign-in-form')).length === 0,
        "Should not see sign in form"
      );
    });
  });
});

test('Poster has account, signed in;', function(assert) {
  var currentUser = authenticateUser(this.application, server);
  const post = server.create('listservContent', {
    user: currentUser
  });

  visit(`/lists/posts/${post.id}`);
  andThen(()=>{
    assert.ok(find(testSelector('component', 'channel-selector')).length,
      "Should see channel selector"
    );
    assert.ok(find(testSelector('component', 'sign-in-form')).length === 0,
      "Should not see sign in form"
    );
  });
});

test('Poster has no account', function(assert) {
  const post = server.create('listserv-content');
  server.create('location');

  visit(`/lists/posts/${post.id}`);
  andThen(()=>{
    assert.ok(find(testSelector('component', 'listserv-registration-form')).length,
      "Should see registration form"
    );

    const lastEvent = this.trackingEvents.pop();
    assert.deepEqual(lastEvent, {
      id: post.id,
      data: {
        enhance_link_clicked: true,
        step_reached: 'new_registration'
      }
    }, "Event tracked for sign in step");

    Workflow.register();

    andThen(()=>{
      assert.ok(find(testSelector('component', 'channel-selector')).length,
        "Should see channel selector"
      );

      assert.ok(find(testSelector('component', 'listserv-registration-form')).length === 0,
        "Should not see registration form"
      );
    });
  });
});

/**
 * CHANNEL WORKFLOWS
 *
 * Challenges:
 * - Cannot test summernote editor input with fillIn.
 * - Cannot write acceptance test for events: date/time selection
 */

/** ENHANCE TALK POST **/
test('Enhance talk post', function(assert) {
  assert.expect(12);
  const done = assert.async(3);

  server.create('location');
  const post = server.create('listserv-content', {
    listserv: server.create('listserv')
  });
  const newTitle = "Newest title";
  let newPostId;

  visit(`/lists/posts/${post.id}`);

  Workflow.register();

  Workflow.selectChannel('talk');

  andThen(()=> {
    assert.deepEqual(this.trackingEvents[1], {
      id: post.id,
      data: {
        channel_type: 'talk'
      }
    }, "Event tracked for channel selection");

    assert.ok(
      find(
        testSelector('component', 'enhance-talk-form')
      ).length > -1,
      "Should see enhance talk form"
    );

    assert.deepEqual(this.trackingEvents[2], {
      id: post.id,
      data: {
        step_reached: 'edit_post'
      }
    }, "Event tracked for edit_post step");

    assert.equal(
      find(testSelector('field', 'talk-title')).val(),
      post.subject,
      "Post subject is talk title"
    );

    /* Would like to test body/content but I don't think summernote
     * makes this possible right now
     */

    Workflow.fillInTalkForm({
      title: newTitle
    });
    //@TODO test image upload
  });

  andThen(()=>{
    const $summary = find(testSelector('component', 'post-details'));
    assert.ok(
      ($summary.text().trim().indexOf(newTitle) > -1),
      "Should see title I have entered"
    );

    assert.deepEqual(this.trackingEvents[3], {
      id: post.id,
      data: {
        step_reached: 'review_post'
      }
    }, "Event tracked for reviewing post");


    server.post('/talk', ({talks}, request) => {
      const attrs = JSON.parse(request.requestBody).talk;
      assert.equal(
        attrs.title,
        newTitle,
        "It creates a new talk post"
      );

      const talk = talks.create(attrs);

      newPostId = talk.id;

      talk.update({
        can_edit: true,
        content_id: talk.id
      });

      done();
      return talk;
    });

    server.put('/listserv_contents/:id', ({talks, listservContents}, request) => {
      const params = JSON.parse(request.requestBody).listserv_content;

      assert.equal(params.subject, newTitle,
        "It updates the listserv content record with changes"
      );

      assert.equal(params.channel_type, 'talk',
        "it sets the channel type"
      );

      const post = talks.first();

      assert.equal(params.content_id, post.id,
        "It sets the content id on the api to match the new post"
      );

      const lc = listservContents.find(request.params.id);
      lc.update(params);

      done();
      return lc;
    });

    click(find(testSelector('action', 'publish')));

    andThen(()=> {
      assert.equal(
        currentURL(),
        `/dashboard?new_content=${newPostId}&type=talk`,
        "Should be on correct dashboard tab with new content item highlighted"
      );

      assert.deepEqual(this.trackingEvents[4], {
        id: post.id,
        data: {
          step_reached: 'published'
        }
      }, "Event tracked for publishing post");

      done();
    });
  });
});

/** ENHANCE MARKET POST **/
test('Enhance market post', function(assert) {
  assert.expect(16);
  const done = assert.async(3);

  server.create('location');
  const post = server.create('listserv-content', {
    listserv: server.create('listserv')
  });
  let newMarketId;

  const newTitle = "Newest title";
  const newPhone = "555-5555";
  const newEmail = "test2@example.org";
  const newPrice = "$40";

  visit(`/lists/posts/${post.id}`);

  Workflow.register();

  Workflow.selectChannel('market');

  andThen(()=> {
    assert.deepEqual(this.trackingEvents[1], {
      id: post.id,
      data: {
        channel_type: 'market'
      }
    }, "Event tracked for channel selection");

    assert.ok(
      find(
        testSelector('component', 'enhance-market-form')
      ).length > -1,
      "Should see enhance market form"
    );

    assert.deepEqual(this.trackingEvents[2], {
      id: post.id,
      data: {
        step_reached: 'edit_post'
      }
    }, "Event tracked for edit_post step");

    assert.equal(
      find(testSelector('field', 'market-title')).val(),
      post.subject,
      "Post subject is market title"
    );
    /* Would like to test body/content but I don't think summernote
     * makes this possible right now
     */

    assert.equal(
      find(testSelector('field', 'market-contactEmail')).val(),
      post.senderEmail,
      "Post senderEmail is market contactEmail"
    );

    Workflow.fillInMarketForm({
      title: newTitle,
      price: newPrice,
      contactEmail: newEmail,
      contactPhone: newPhone,
    });
    //@TODO test image upload
  });

  andThen(()=>{
    const $summary = find(testSelector('component', 'post-details'));
    assert.ok(
      ($summary.text().trim().indexOf(newTitle) > -1),
      "Should see title I have entered"
    );

    assert.deepEqual(this.trackingEvents[3], {
      id: post.id,
      data: {
        step_reached: 'review_post'
      }
    }, "Event tracked for reviewing post");

    assert.ok(
      ($summary.text().trim().indexOf(newPrice) > -1),
      "Should see price I have entered"
    );

    assert.ok(
      ($summary.text().trim().indexOf(newPhone) > -1),
      "Should see phone number I have entered"
    );

    assert.ok(
      ($summary.text().trim().indexOf(newEmail) > -1),
      "Should see email I have entered"
    );

    server.post('/market_posts', ({marketPosts}, request) => {
      const attrs = JSON.parse(request.requestBody).market_post;
      assert.equal(
        attrs.title,
        newTitle,
        "It creates a new market post"
      );

      const market = marketPosts.create(attrs);

      newMarketId = market.id;
      market.update({contentId: market.id});

      done();
      return market;
    });

    server.put('/listserv_contents/:id', ({marketPosts, listservContents}, request) => {
      const params = JSON.parse(request.requestBody).listserv_content;

      assert.equal(params.subject, newTitle,
        "It updates the listserv content record with changes"
      );

      assert.equal(params.channel_type, 'market',
        "it sets the channel type"
      );

      const post = marketPosts.first();

      assert.equal(params.content_id, post.contentId,
        "It sets the content id on the api to match the new post"
      );

      const lc = listservContents.find(request.params.id);
      lc.update(params);

      done();
      return lc;
    });

    click(find(testSelector('action', 'publish')));

    andThen(()=> {
      assert.equal(
        currentURL(),
        `/dashboard?new_content=${newMarketId}&type=market`,
        "Should be on correct dashboard tab with new content item highlighted"
      );

      assert.deepEqual(this.trackingEvents[4], {
        id: post.id,
        data: {
          step_reached: 'published'
        }
      }, "Event tracked for publishing post");
      done();
    });
  });
});
