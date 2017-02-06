/* global sinon */
import Ember from 'ember';
import { test, skip } from 'qunit';
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
  signInThroughForm() {
    fillIn(testSelector('field', 'sign-in-form-password'), "password");
    click(testSelector('component', 'sign-in-form-submit'));
  },
  registerThroughForm() {

    fillIn(testSelector('field', 'registration-form-name'), 'Edgar Poe');
    fillIn(testSelector('field', 'registration-form-password'), 'ravenPerch');

    let $locationSelect = find(testSelector('component', 'registration-form-location')).find('select');
    $locationSelect.val($locationSelect.find('option:last').val());
    $locationSelect.change();

    click(find(testSelector('component', 'registration-form-submit')));
  },
  selectChannel(channel) {
    click(testSelector(`select-channel-type-${channel}`));
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

    Workflow.signInThroughForm();

    andThen(() => {
      assert.ok(find(testSelector('component', 'listserv-content-form')).length,
        "Should see form to update post"
      );
       assert.ok(find(testSelector('component', 'sign-in-form')).length === 0,
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
    assert.ok(find(testSelector('component', 'listserv-content-form')).length,
      "Should see form to update post"
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

    Workflow.registerThroughForm();

    andThen(()=>{
      assert.ok(find(testSelector('component', 'listserv-content-form')).length,
        "Should see form to update post"
      );
    });
  });
});

test('Enhance talk post', function(assert) {
  assert.expect(5);
  server.create('location');
  const post = server.create('listserv-content');

  visit(`/lists/posts/${post.id}`);

  andThen(()=> Workflow.registerThroughForm());

  andThen(()=> Workflow.selectChannel('talk'));

  andThen(()=> {
    const newTitle = "NEW title";

    fillIn(testSelector('field', 'talk-title'), newTitle);
    click(testSelector('listserv-content-submit-enhance'));

    andThen(()=>{
      assert.ok(find(testSelector('component', 'listserv-content-preview')).length,
        "Should see preview page"
      );

      const done = assert.async();
      server.put('/listserv_contents/:id', (schema, request) => {
        const params = JSON.parse(request.requestBody).listserv_content;

        assert.equal(params.subject, newTitle,
          "It updates the listserv content record"
        );

        assert.equal(params.channel_type, 'talk',
          "it sets the channel type"
        );

        const post = schema.talks.first();

        assert.equal(params.content_id, post.id,
          "It sets the content id on the api to match the new post"
        );
        done();
      });

      click(find(testSelector('component', 'preview-publish')));
      andThen(()=> {
        assert.ok((new RegExp('^/talk/\\d+')).test(currentURL()),
          "Should be viewing my newly created post on dailyUV"
        );
      });
    });
  });
});

test('Enhance market post', function(assert) {
  assert.expect(5);
  server.create('location');
  const post = server.create('listserv-content');

  visit(`/lists/posts/${post.id}`);

  andThen(()=> Workflow.registerThroughForm());

  andThen(()=> Workflow.selectChannel('market'));

  andThen(()=> {
    const newTitle = "NEW Market title";

    fillIn(testSelector('field', 'market-title'), newTitle);
    click(testSelector('listserv-content-submit-enhance'));

    andThen(()=>{
      assert.ok(find(testSelector('component', 'listserv-content-preview')).length,
        "Should see preview page"
      );

      const done = assert.async();
      server.put('/listserv_contents/:id', (schema, request) => {
        const params = JSON.parse(request.requestBody).listserv_content;

        assert.equal(params.subject, newTitle,
          "It updates the listserv content record"
        );

        assert.equal(params.channel_type, 'market',
          "it sets the channel type"
        );

        const post = schema.marketPosts.first();

        assert.equal(params.content_id, post.id,
          "It sets the content id on the api to match the new post"
        );
        done();
      });

      click(find(testSelector('component', 'preview-publish')));
      andThen(()=> {
        assert.ok((new RegExp('^/market/\\d+')).test(currentURL()),
          "Should be viewing my newly created post on dailyUV"
        );
      });
    });
  });
});
/**
 * This needs work, I cant get the test to set a event date
 */
skip('Enhance event post', function(assert) {

  assert.expect(5);
  server.create('location');
  const venue = server.create('venue');
  const post = server.create('listserv-content');

  visit(`/lists/posts/${post.id}`);

  andThen(()=> Workflow.registerThroughForm());

  andThen(()=> Workflow.selectChannel('event'));

  andThen(()=> {
    const newTitle = "NEW Event title";

    fillIn(testSelector('field', 'event-title'), newTitle);

    const venueField = find(testSelector('field', 'venue-search'));
    fillIn(venueField, venue.name);
    triggerEvent(venueField, 'keyup');
    click(testSelector('venue-result'));

    click(testSelector('event-form-add-single-date'));
    andThen(()=>{
      const pikadayField = find(testSelector('event-date-pikaday'));

      click(find('input', pikadayField));
      andThen(()=>{
        click(find('button.pika-day'));
      });
    });

    fillIn(testSelector('field', 'start-time'), '09:00 am');
    fillIn(testSelector('field', 'start-time'), '09:00 pm');

    click(testSelector('save-event-date'));

    click(testSelector('listserv-content-submit-enhance'));

    andThen(()=>{
      assert.ok(find(testSelector('component', 'listserv-content-preview')).length,
        "Should see preview page"
      );

      const done = assert.async();
      server.put('/listserv_contents/:id', (schema, request) => {
        const params = JSON.parse(request.requestBody).listserv_content;

        assert.equal(params.subject, newTitle,
          "It updates the listserv content record"
        );

        assert.equal(params.channel_type, 'event',
          "it sets the channel type"
        );

        const post = schema.events.first();

        assert.equal(params.content_id, post.contentId,
          "It sets the content id on the api to match the new post"
        );
        done();
      });

      click(find(testSelector('component', 'preview-publish')));
      andThen(()=> {
        assert.ok((new RegExp('^/market/\\d+')).test(currentURL()),
          "Should be viewing my newly created post on dailyUV"
        );
      });
    });
  });
});
