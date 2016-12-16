import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import { module, skip } from 'qunit';
/* global sinon */

module('Unit | Utility | social sharing');

const { stub } = sinon;
const { RSVP } = Ember;

skip('createShareCache calls prerenderCache once on request', function(assert) {
  assert.expect(1);

  const cachePrerender = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cachePrerender = cachePrerender;

  SocialSharing.createShareCache().then(() => {
    // TODO we shouldn't be stubbing out methods on the test subject
    // it would be better to assert that the $.post method was called with
    // specific arguments ~cm
    assert.ok(cachePrerender.calledOnce, 'called the cachePrerender method once');
  });
});

skip('updatesharecache calls prerendercache once on request', function(assert) {
  assert.expect(1);

  const cachePrerender = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cachePrerender = cachePrerender;

  SocialSharing.updateShareCache().then(() => {
    // TODO we shouldn't be stubbing out methods on the test subject in a unit test ~cm
    assert.ok(cachePrerender.calledOnce, 'called the cacheprerender method once');
  });
});

skip('facebook share calls to graph once on request', function(assert) {
  assert.expect(1);

  const cacheFacebook = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cacheFacebook = cacheFacebook;

  SocialSharing.checkFacebookCache().then(() => {
    // TODO we shouldn't be stubbing out methods on the test subject in a unit test ~cm
    // instead we should test that the $.post method was called with specific arguments
    assert.ok(cacheFacebook.calledOnce, 'called the cacheFacebook method once');
  });
});
