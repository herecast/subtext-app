/* global sinon */
import {moduleFor, test} from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import Ember from 'ember';

moduleFor('service:tracking', 'Unit | Service | tracking', {
  // Specify the other units that are required for this test.
  needs: ['service:user-location', 'service:cookies', 'service:geolocation', 'service:session',
    'service:api', 'service:window-location', 'service:history', 'service:fastboot', 'service:user',
    'service:intercom', 'service:notification-messages'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('trackTileLoad', function(assert) {
  let currentUser = {
    canEditContent() {
      return false;
    }
  };

  let service = this.subject({
    currentUser: Ember.RSVP.Promise.resolve(currentUser)
  });
  service.push = sinon.spy();

  const content = {
    contentType: 'news',
    contentId: 1,
    organizationId: 21
  };

  service.trackTileLoad(content);

  return wait().then(()=>{
    assert.deepEqual(service.push.lastCall.args[0], {
      event: 'VirtualTileLoad',
      content_type: content.contentType,
      content_id: content.contentId,
      organization_id: content.organizationId
    }, "It sends a VirtualTileLoad event to the data layer, with expected fields");
  });
});


test('trackTileImpression', function(assert) {
  let currentUser = {
    canEditContent() {
      return false;
    }
  };

  let service = this.subject({
    currentUser: Ember.RSVP.Promise.resolve(currentUser)
  });
  service.push = sinon.spy();

  const content = {
    contentType: 'news',
    contentId: 1,
    organizationId: 21
  };

  const impressionLocation = 'index-feed';

  service.trackTileImpression({model: content, impressionLocation: impressionLocation});

  return wait().then(()=>{
    assert.deepEqual(service.push.lastCall.args[0], {
      event: 'VirtualTileImpression',
      content_type: content.contentType,
      content_id: content.contentId,
      organization_id: content.organizationId,
      impression_location: impressionLocation
    }, "It sends a VirtualTileImpression event to the data layer, with expected fields");
  });
});

test('User can edit content', function(assert) {
  let currentUser = {
    canEditContent() {
      return true;
    }
  };

  let service = this.subject({
    session: {
      isAuthenticated: true
    },
    currentUser: Ember.RSVP.Promise.resolve(currentUser)
  });

  service.push = sinon.spy();

  const content = {
    contentType: 'news',
    contentId: 1,
    organizationId: 21
  };

  service.trackTileLoad(content);
  service.trackTileImpression({model:content, impressionLocation: 'index-feed'});

  return wait().then(()=>{
    assert.notOk(service.push.called,
      "It does not send tile tracking events for a user who can edit the content.");
  });
});
