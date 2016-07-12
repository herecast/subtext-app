import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';
import { module, test } from 'qunit';
/* global sinon */

module('Unit | Utility | social sharing');

const { stub } = sinon;
const { RSVP } = Ember;

test('createShareCache calls prerenderCache once on request', function(assert) {

  const cachePrerender = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cachePrerender = cachePrerender;

  return SocialSharing.createShareCache().then(() => {
    assert.ok(cachePrerender.calledOnce, 'called the cachePrerender method once');
  });
});

test('updateShareCache calls prerenderCache once on request', function(assert) {

  const cachePrerender = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cachePrerender = cachePrerender;

  return SocialSharing.updateShareCache().then(() => {
    assert.ok(cachePrerender.calledOnce, 'called the cachePrerender method once');
  });
});

test('facebook share calls to graph once on request', function(assert) {

  const cacheFacebook = stub().returns(RSVP.Promise.resolve());

  SocialSharing.cacheFacebook = cacheFacebook;

  return SocialSharing.checkFacebookCache().then(() => {
    assert.ok(cacheFacebook.calledOnce, 'called the cacheFacebook method once');
  });
});
