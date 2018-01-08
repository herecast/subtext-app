/* global sinon */
import {moduleFor, test} from 'ember-qunit';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

const {
  RSVP
} = Ember;

moduleFor('service:tracking', 'Unit | Service | tracking', {
  // Specify the other units that are required for this test.
  needs: ['service:user-location', 'service:cookies', 'service:geolocation', 'service:session',
    'service:api', 'service:window-location', 'service:history', 'service:fastboot', 'service:user',
    'service:intercom'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('trackTileLoad', function(assert) {
  let service = this.subject({
    permissions: {
      canEdit() {
        return RSVP.resolve(false);
      }
    }
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
  let service = this.subject({
    permissions: {
      canEdit() {
        return RSVP.resolve(false);
      }
    }
  });
  service.push = sinon.spy();

  const content = {
    contentType: 'news',
    contentId: 1,
    organizationId: 21
  };

  service.trackTileImpression(content);

  return wait().then(()=>{
    assert.deepEqual(service.push.lastCall.args[0], {
      event: 'VirtualTileImpression',
      content_type: content.contentType,
      content_id: content.contentId,
      organization_id: content.organizationId
    }, "It sends a VirtualTileImpression event to the data layer, with expected fields");
  });
});

test('User can edit content', function(assert) {
  let service = this.subject({
    permissions: {
      canEdit() {
        return RSVP.resolve(true);
      }
    }
  });

  service.push = sinon.spy();

  const content = {
    contentType: 'news',
    contentId: 1,
    organizationId: 21
  };

  service.trackTileLoad(content);
  service.trackTileImpression(content);

  return wait().then(()=>{
    assert.notOk(service.push.called,
      "It does not send tile tracking events for a user whoe can edit the content.");
  });
});
