import Service from '@ember/service';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import { visit, click, currentURL, fillIn, find, findAll, getContext } from '@ember/test-helpers';
import sinon from 'sinon';

module('Acceptance | likes', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    loadPioneerFeed(false);
  });

  function createGenericContents(server, numberOfContents) {
    const contents = server.createList('content', numberOfContents);

    let contentIds = contents.map(content => content.id);

    contentIds.forEach((id) => {
      server.create('feedItem', {
        modelType: 'content',
        contentId: id
      });
    });

    return contents;
  }

  test('Visiting / not signed in, signing in, and then like process', async function(assert) {
    mockLocationCookie(this.server);
    const trackingSpy = sinon.spy();
    const tracking = Service.extend({
      trackLikeEvent: trackingSpy
    });

    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card/like', 'tracking', 'services:trackingMock');

    const done = assert.async(2);
    const numberOfContents = 5;

    const contents = createGenericContents(this.server, numberOfContents);

    await visit('/');

    assert.equal(findAll('[data-test-feed-card]').length, numberOfContents, 'All feed cards should show');
    assert.equal(findAll('[data-test-like]').length, numberOfContents, 'All feed cards should show a like');
    assert.equal(findAll('[data-test-like="not-liked"]').length, numberOfContents, 'All likes should be not liked');
    assert.equal(findAll('[data-test-like="liked"]').length, 0, 'No likes should be liked');

    await click(find('[data-test-button="like-icon"]'));

    assert.ok(trackingSpy.calledWith('UnregisteredClick'), 'Clicking on like when unregistered should trigger tracking event');
    assert.ok(findAll('[data-test-component="sign-in"]').length, 'Should show the sign-in modal after like click');

    const currentUser = this.server.create('current-user', {
      userId: 1
    });

    await fillIn('[data-test-field="sign-in-email"]', currentUser.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click(find('[data-test-component="sign-in-submit"]'));

    assert.equal(currentURL(), '/', 'Should direct to homepage after sign in');
    assert.equal(findAll('[data-test-like="not-liked"]').length, numberOfContents, 'All likes should be not liked');

    let $firstLike = $(find(`[data-test-like-content="${contents[0].id}"]`));

    this.server.post('/casters/:id/likes', function(db) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.casterId, currentUser.userId, 'Server should receive correct casterId for like create');
      assert.equal(attrs.contentId, contents[0].id, 'Server should receive correct contentId for like create');
      assert.equal(attrs.read, false, 'Server should receive correct default value of false for read on like create');
      done();

      return db.likes.create(attrs);
    });

    const likeCountBeforeClick = parseInt($firstLike.attr('data-test-like-like-count'));

    await click($firstLike.find('[data-test-button="like-icon"]')[0]);

    assert.ok(trackingSpy.calledWith('CreateLike'), 'Making new like should trigger tracking event');

    const likeCountAfterClick = parseInt($firstLike.attr('data-test-like-like-count'));

    assert.equal(likeCountAfterClick, (likeCountBeforeClick + 1), "Clicking like should increase like count by one");

    let $firstFeedCard = $(find(`[data-test-content="${contents[0].id}"]`));

    assert.ok($firstFeedCard.find('[data-test-like="liked"]').length, 'Clicked like should be liked');

    this.server.delete('/casters/:id/likes/:id', function() {
      assert.ok(true, 'Server should receive like delete request');
      done();

      return {};
    });

    await click($firstFeedCard.find('[data-test-button="like-icon"]')[0]);

    assert.ok(trackingSpy.calledWith('RemoveLike'), 'Removing like should trigger tracking event');

    $firstFeedCard = $(find(`[data-test-content="${contents[0].id}"]`));

    assert.ok($firstFeedCard.find('[data-test-like="not-liked"]').length, 'Deleted like should not be liked');
  });


  test('Visiting homepage signed in with likes', async function(assert) {
    mockLocationCookie(this.server);
    const trackingSpy = sinon.spy();
    const tracking = Service.extend({
      trackLikeEvent: trackingSpy
    });
    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card/like', 'tracking', 'services:trackingMock');

    const currentUser = this.server.create('current-user', {
      userId: 1
    });
    authenticateUser(this.server, currentUser);

    const numberOfLikedContents = 2;
    const numberOfUnLikedContents = 3;
    const numberOfContents = numberOfLikedContents + numberOfUnLikedContents;
    const contents = createGenericContents(this.server, numberOfContents);

    contents.forEach((content, index) => {
      if (index < numberOfLikedContents) {
        this.server.create('like', {
          userId: currentUser.userId,
          contentId: content.id,
          read: false
        });
      }
    });

    await visit('/');

    assert.equal(findAll('[data-test-like]').length, numberOfContents, 'All feed cards should show a like');
    assert.equal(findAll('[data-test-like="liked"]').length, numberOfLikedContents, 'Only liked cards should be liked');

  });

});
