import sinon from 'sinon';
import { Promise } from 'rsvp';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

module('Unit | Service | tracking', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:tracking');
    assert.ok(service);
  });

  test('trackTileLoad', function(assert) {
    let currentUser = {
      canEditContent() {
        return false;
      }
    };

    let service = this.owner.factoryFor('service:tracking').create({
      currentUser: Promise.resolve(currentUser)
    });
    service.push = sinon.spy();

    const content = {
      contentType: 'news',
      contentId: 1
    };

    service.trackTileLoad(content);

    return settled().then(()=>{
      assert.deepEqual(service.push.lastCall.args[0], {
        event: 'VirtualTileLoad',
        content_type: content.contentType,
        content_id: content.contentId
      }, "It sends a VirtualTileLoad event to the data layer, with expected fields");
    });
  });


  test('trackTileImpression', function(assert) {
    let currentUser = {
      canEditContent() {
        return false;
      }
    };

    let service = this.owner.factoryFor('service:tracking').create({
      currentUser: Promise.resolve(currentUser)
    });
    service.push = sinon.spy();

    const content = {
      contentType: 'news',
      contentId: 1
    };

    const impressionLocation = 'index-feed';

    service.trackTileImpression({model: content, impressionLocation: impressionLocation});

    return settled().then(()=>{
      assert.deepEqual(service.push.lastCall.args[0], {
        event: 'VirtualTileImpression',
        content_type: content.contentType,
        content_id: content.contentId,
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

    let service = this.owner.factoryFor('service:tracking').create({
      session: {
        isAuthenticated: true
      },
      currentUser: Promise.resolve(currentUser)
    });

    service.push = sinon.spy();

    const content = {
      contentType: 'news',
      contentId: 1
    };

    service.trackTileLoad(content);
    service.trackTileImpression({model:content, impressionLocation: 'index-feed'});

    return settled().then(()=>{
      assert.notOk(service.push.called,
        "It does not send tile tracking events for a user who can edit the content.");
    });
  });
});
