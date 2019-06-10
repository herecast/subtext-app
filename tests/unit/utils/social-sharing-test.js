import RSVP from 'rsvp';
import SocialSharing from 'subtext-app/utils/social-sharing';
import { module, skip } from 'qunit';
import sinon from 'sinon';

module('Unit | Utility | social sharing', function() {
  const { stub } = sinon;

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
});
