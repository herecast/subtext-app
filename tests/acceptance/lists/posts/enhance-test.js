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

test('Poster has account, signed in;', function(assert) {
  server.create('location');
  var currentUser = authenticateUser(this.application, server);

  const listserv = server.create('listserv');
  const post = server.create('listservContent', {
    user: currentUser,
    listserv: listserv,
    channelType: 'talk',
    subject: 'the punch line',
    body: 'an explanation that might be interesting'
  });

  visit(`/lists/posts/${post.id}`);
  andThen(() => {
    assert.ok(find(testSelector('component', 'listserv-content-form')).length,
      "Should see enhance form"
    );

    assert.equal(find(testSelector('field', 'talk-title')).val(), post.subject, 'it should auto-fill the title text field with the listserv subject');
    assert.equal(find('[data-test-component="talk-content"] .note-editable').text(), post.body, 'it should auto-fill the content textarea with the listserv body');

    click(testSelector('listserv-content-submit-enhance')).then(() => {
      assert.ok(find(testSelector('component', 'listserv-content-preview')).length,
        "After submitting form, should see a preview."
      );

      click(testSelector('component', 'preview-publish')).then(() => {
        assert.ok(/^\/talk\/\d/.test(currentURL()),
          "Should be on the detail page of the enhanced content record"
        );

        assert.ok(infoSpy.called, 'Displays confirmation message');
      });
    });
  });
});

test('Poster has account, signed in as someone else', function(assert) {
  server.create('location');

  const listserv = server.create('listserv');
  const postOwner = server.create('user', {
    email: 'wycats@emberjs.com'
  });

  const post = server.create('listservContent', {
    senderEmail: postOwner.email,
    user: postOwner,
    listserv: listserv,
    channelType: 'talk',
    subject: 'the punch line',
    body: 'an explanation that might be interesting'
  });

  visit(`/lists/posts/${post.id}`).then(() => {
    assert.ok(find(testSelector('component', 'sign-in-form')).length,
      "Should see sign in form"
    );

    let $emailField = find(testSelector('listserv-sign-in-form-email'));
    assert.equal($emailField.text(), postOwner.email,
      "Email is pre-filled with owner email on sign in form"
    );

    fillIn(testSelector('field', 'sign-in-form-password'), "password");

    click(testSelector('component', 'sign-in-form-submit')).then(() => {
      assert.ok(find(testSelector('component', 'listserv-content-form')).length,
        "Should see enhance form"
      );
    });
  });
});

test('Poster has no account, signed in as someone else', function(assert) {
  server.create('location');
  authenticateUser(this.application, server, server.create('user', {
    email: 'tomster@emberjs.com'
  }));

  const listserv = server.create('listserv');

  const post = server.create('listservContent', {
    senderEmail: "wycats@emberjs.com",
    user: null,
    listserv: listserv,
    channelType: 'talk',
    subject: 'the punch line',
    body: 'an explanation that might be interesting'
  });


  visit(`/lists/posts/${post.id}`).then(() => {
    assert.ok(find(testSelector('component', 'registration-form')).length,
      "Should see registration form"
    );

    let $emailField = find(testSelector('field', 'registration-form-email'));
    assert.equal($emailField.val(), post.senderEmail,
      "Email is prefilled"
    );
    assert.equal($emailField.attr('disabled'), 'disabled',
      "Cannot edit email"
    );

    fillIn(testSelector('field', 'registration-form-name'), 'Edgar Poe');
    fillIn(testSelector('field', 'registration-form-password'), 'ravenPerch');

    let $locationSelect = find(testSelector('component', 'registration-form-location')).find('select');
    $locationSelect.val($locationSelect.find('option:last').val());
    $locationSelect.change();

    click(find(testSelector('component', 'registration-form-submit'))).then(() => {
      assert.ok(find(testSelector('component', 'listserv-content-form')).length,
        "Should see enhance form"
      );
    });

  });
});

test('Poster has no account, not signed in', function(assert) {
  server.create('location');// for location dropdown during registration
  let listserv = server.create('listserv');

  const post = server.create('listservContent', {
    user: null,
    senderEmail: 'ed@poe.com',
    listserv: listserv,
    channelType: 'talk',
    subject: 'the punch line',
    body: 'an explanation that might be interesting'
  });


  visit(`/lists/posts/${post.id}`).then(() => {
    assert.ok(find(testSelector('component', 'registration-form')).length,
      "Should see registration form"
    );

    let $emailField = find(testSelector('field', 'registration-form-email'));
    assert.equal($emailField.val(), post.senderEmail,
      "Email is prefilled"
    );
    assert.equal($emailField.attr('disabled'), 'disabled',
      "Cannot edit email"
    );

    fillIn(testSelector('field', 'registration-form-name'), 'Edgar Poe');
    fillIn(testSelector('field', 'registration-form-password'), 'ravenPerch');

    let $locationSelect = find(testSelector('component', 'registration-form-location')).find('select');
    $locationSelect.val($locationSelect.find('option:last').val());
    $locationSelect.change();

    click(find(testSelector('component', 'registration-form-submit'))).then(() => {
      assert.ok(find(testSelector('component', 'listserv-content-form')).length,
        "Should see enhance form"
      );
    });

  });
});
