import Service from '@ember/service';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession} from 'ember-simple-auth/test-support';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import { visit, click, currentURL, fillIn, find, findAll, getContext } from '@ember/test-helpers';
import sinon from 'sinon';

module('Acceptance | bookmarks', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
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

  test('Visiting / not signed in, signing in, and then bookmark process', async function(assert) {
    const trackingSpy = sinon.spy();
    const tracking = Service.extend({
      trackBookmarkEvent: trackingSpy
    });

    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card/bookmark', 'tracking', 'services:trackingMock');

    const done = assert.async(3);
    const numberOfContents = 5;

    const contents = createGenericContents(this.server, numberOfContents);

    await visit('/');

    assert.equal(findAll('[data-test-feed-card]').length, numberOfContents, 'All feed cards should show');
    assert.equal(findAll('[data-test-bookmark]').length, numberOfContents, 'All feed cards should show a bookmark');
    assert.equal(findAll('[data-test-bookmark="not-bookmarked"]').length, numberOfContents, 'All bookmarks should be not bookmarked');
    assert.equal(findAll('[data-test-bookmark="bookmarked"]').length, 0, 'No bookmarks should be bookmarked');
    assert.notOk(findAll('[data-test-bookmark-tooltip]').length, 'Should not show the tooltip for not logged in users');

    await click(find('[data-test-button="bookmark-icon"]'));

    assert.ok(trackingSpy.calledWith('UnregisteredClick'), 'Clicking on bookmark when unregistered should trigger tracking event');
    assert.ok(findAll('[data-test-component="sign-in"]').length, 'Should show the sign-in modal after bookmark click');

    const currentUser = this.server.create('current-user', {
      userId: 1,
      hasHadBookmarks: false
    });

    await fillIn('[data-test-field="sign-in-email"]', currentUser.email);
    await fillIn('[data-test-field="sign-in-password"]', 'password');

    await click(find('[data-test-component="sign-in-submit"]'));

    assert.equal(currentURL(), '/', 'Should direct to homepage after sign in');
    assert.ok(findAll('[data-test-bookmark-tooltip]').length, 'Should show the tooltip for user who has not had bookmarks');

    this.server.put('/current_user', function(db) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.hasHadBookmarks, true, 'Api endpoint called with correct change to hasHadBookmarks property');
      done();

      const currentUser = db.currentUsers.findBy({userId: attrs.userId});
      return currentUser.update(attrs);
    });

    await click('[data-test-button="close-tooltip"]');

    assert.ok(trackingSpy.calledWith('CloseTooltip'), 'Clicking on tooltip close should send bookmark tracking event');
    assert.equal(findAll('[data-test-bookmark-tooltip]').length, 0, 'After tooltip click close button, should remove tooltip');

    let $firstBookmark = $(find(`[data-test-bookmark-content="${contents[0].id}"]`));

    this.server.post('/users/:id/bookmarks', function(db) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.userId, currentUser.userId, 'Server should receive correct userId for bookmark create');
      assert.equal(attrs.contentId, contents[0].id, 'Server should receive correct contentId for bookmark create');
      assert.equal(attrs.read, false, 'Server should receive correct default value of false for read on bookmark create');
      done();

      return db.bookmarks.create(attrs);
    });

    await click($firstBookmark.find('[data-test-button="bookmark-icon"]')[0]);

    assert.ok(trackingSpy.calledWith('CreateBookmark'), 'Making new bookmark should trigger tracking event');

    let $firstFeedCard = $(find(`[data-test-content="${contents[0].id}"]`));

    assert.ok($firstFeedCard.find('[data-test-bookmark="bookmarked"]').length, 'Clicked bookmark should be bookmarked');
    assert.ok($firstFeedCard.find('[data-test-bookmark-status="not-read"]').length, 'Clicked bookmark should be unread');

    this.server.delete('/users/:id/bookmarks/:id', function() {
      assert.ok(true, 'Server should receive bookmark delete request');
      done();

      return {};
    });

    await click($firstFeedCard.find('[data-test-button="bookmark-icon"]')[0]);

    assert.ok(trackingSpy.calledWith('RemoveBookmark'), 'Removing bookmark should trigger tracking event');

    $firstFeedCard = $(find(`[data-test-content="${contents[0].id}"]`));

    assert.ok($firstFeedCard.find('[data-test-bookmark="not-bookmarked"]').length, 'Deleted bookmark should not be bookmarked');
  });


  test('Visiting homepage signed in with bookmarks', async function(assert) {
    const trackingSpy = sinon.spy();
    const tracking = Service.extend({
      trackBookmarkEvent: trackingSpy
    });
    const { owner } = getContext();

    owner.register('services:trackingMock', tracking);
    owner.inject('component:feed-card/bookmark', 'tracking', 'services:trackingMock');

    const done = assert.async();
    const currentUser = this.server.create('current-user', {
      userId: 1,
      hasHadBookmarks: true
    });
    authenticateUser(this.server, currentUser);

    const numberOfBookmarkedContents = 2;
    const numberOfUnBookmarkedContents = 3;
    const numberOfContents = numberOfBookmarkedContents + numberOfUnBookmarkedContents;
    const contents = createGenericContents(this.server, numberOfContents);

    contents.forEach((content, index) => {
      if (index < numberOfBookmarkedContents) {
        this.server.create('bookmark', {
          userId: currentUser.userId,
          contentId: content.id,
          read: false
        });
      }
    });

    await visit('/');

    assert.equal(findAll('[data-test-bookmark]').length, numberOfContents, 'All feed cards should show a bookmark');
    assert.equal(findAll('[data-test-bookmark="bookmarked"]').length, numberOfBookmarkedContents, 'Only bookmarked cards should be bookmarked');
    assert.equal(findAll('[data-test-bookmark-status="not-read"]').length, numberOfBookmarkedContents, 'Not read bookmarks should show as unread');

    this.server.put('/users/:id/bookmarks/:id', function(db) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.read, true, 'Server gets request to change read status to true on detail view');
      done();

      const bookmark = db.bookmarks.find(attrs.id);
      return bookmark.update(attrs);
    });

    await visit(`/${contents[0].id}`);

    assert.ok(trackingSpy.calledWith('ReadBookmark'), 'When bookmark status is changed to read, tracking event should fire');
    let $detailView = $(find(`[data-test-content="${contents[0].id}"]`));

    assert.equal($detailView.find('[data-test-bookmark-status="not-read"]').length, 0, 'After detail view, unread bookmark should not show');
    assert.ok($detailView.find('[data-test-bookmark-status="read"]').length, 'After detail view, read bookmark should show');
  });

});
