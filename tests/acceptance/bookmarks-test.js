import { test } from 'qunit';
import { invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import Ember from 'ember';
/* global sinon */

moduleForAcceptance('Acceptance | bookmarks', {
  beforeEach() {
    invalidateSession(this.application);
  }
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

test('Visiting /feed not signed in, signing in, and then bookmark process', function(assert) {
  const trackingSpy = sinon.spy();
  const tracking = Ember.Service.extend({
    trackBookmarkEvent: trackingSpy
  });

  this.application.register('services:trackingMock', tracking);
  this.application.inject('component:feed-card/bookmark', 'tracking', 'services:trackingMock');

  const done = assert.async(3);
  const numberOfContents = 5;
  const contents = createGenericContents(server, numberOfContents);

  visit('/feed');

  andThen(function() {
    assert.equal(find(testSelector('feed-card')).length, numberOfContents, 'All feed cards should show');
    assert.equal(find(testSelector('bookmark')).length, numberOfContents, 'All feed cards should show a bookmark');
    assert.equal(find(testSelector('bookmark', 'not-bookmarked')).length, numberOfContents, 'All bookmarks should be not bookmarked');
    assert.equal(find(testSelector('bookmark', 'bookmarked')).length, 0, 'No bookmarks should be bookmarked');

    click(find(testSelector('button', 'bookmark-icon'))[0]);

    andThen(function() {
      assert.ok(trackingSpy.calledWith('UnregisteredClick'), 'Clicking on bookmark when unregistered should trigger tracking event');
      assert.ok(find(testSelector('component', 'sign-in')).length, 'Should show the sign-in modal after bookmark click');

      const currentUser = server.create('current-user', {
        userId: 1,
        hasHadBookmarks: false
      });

      fillIn(testSelector('field', 'sign-in-email'), currentUser.email);
      fillIn(testSelector('field', 'sign-in-password'), 'password');

      click(testSelector('component', 'sign-in-submit'));

      andThen(function() {
        assert.ok(currentURL().indexOf('/feed') >= 0, 'Should direct feed after sign in');
        assert.ok(find(testSelector('bookmark-tooltip')).length, 'Should show the tooltip for user who has not had bookmarks');

        click(testSelector('button', 'close-tooltip'));

        server.put('/current_user', function(db) {
          let attrs = this.normalizedRequestAttrs();
          assert.equal(attrs.hasHadBookmarks, true, 'Api endpoint called with correct change to hasHadBookmarks property');
          done();

          const currentUser = db.currentUsers.findBy({userId: attrs.userId});
          return currentUser.update(attrs);
        });

        andThen(function() {
          assert.ok(trackingSpy.calledWith('CloseTooltip'), 'Clicking on tooltip close should send bookmark tracking event');
          assert.equal(find(testSelector('bookmark-tooltip')).length, 0, 'After tooltip click close button, should remove tooltip');

          let $firstBookmark = find(testSelector('bookmark-content', contents[0].id));
          click($firstBookmark.find(testSelector('button', 'bookmark-icon')));

          server.post('/users/:id/bookmarks', function(db) {
            let attrs = this.normalizedRequestAttrs();
            assert.equal(attrs.userId, currentUser.userId, 'Server should receive correct userId for bookmark create');
            assert.equal(attrs.contentId, contents[0].id, 'Server should receive correct contentId for bookmark create');
            assert.equal(attrs.read, false, 'Server should receive correct default value of false for read on bookmark create');
            done();

            return db.bookmarks.create(attrs);
          });

          andThen(function() {
            assert.ok(trackingSpy.calledWith('CreateBookmark'), 'Making new bookmark should trigger tracking event');
            let $firstFeedCard = find(testSelector('content', contents[0].id));

            assert.ok($firstFeedCard.find(testSelector('bookmark', 'bookmarked')).length, 'Clicked bookmark should be bookmarked');
            assert.ok($firstFeedCard.find(testSelector('bookmark-status', 'not-read')).length, 'Clicked bookmark should be unread');

            click($firstFeedCard.find(testSelector('button', 'bookmark-icon')));

            server.delete('/users/:id/bookmarks/:id', function() {
              assert.ok(true, 'Server should receive bookmark delete request');
              done();

              return {};
            });

            andThen(function() {
                assert.ok(trackingSpy.calledWith('RemoveBookmark'), 'Removing bookmark should trigger tracking event');
              let $firstFeedCard = find(testSelector('content', contents[0].id));

              assert.ok($firstFeedCard.find(testSelector('bookmark', 'not-bookmarked')).length, 'Deleted bookmark should not be bookmarked');
            });
          });
        });
      });
    });
  });
});

test('Visiting /feed signed in with bookmarks', function(assert) {
  const trackingSpy = sinon.spy();
  const tracking = Ember.Service.extend({
    trackBookmarkEvent: trackingSpy
  });

  this.application.register('services:trackingMock', tracking);
  this.application.inject('component:feed-card/bookmark', 'tracking', 'services:trackingMock');

  const done = assert.async();
  const currentUser = server.create('current-user', {
    userId: 1,
    hasHadBookmarks: true
  });
  authenticateUser(this.application, currentUser);

  const numberOfBookmarkedContents = 2;
  const numberOfUnBookmarkedContents = 3;
  const numberOfContents = numberOfBookmarkedContents + numberOfUnBookmarkedContents;
  const contents = createGenericContents(server, numberOfContents);

  contents.forEach((content, index) => {
    if (index < numberOfBookmarkedContents) {
      server.create('bookmark', {
        userId: currentUser.userId,
        contentId: content.id,
        read: false
      });
    }
  });

  visit('/feed');

  andThen(function() {
    assert.equal(find(testSelector('bookmark')).length, numberOfContents, 'All feed cards should show a bookmark');
    assert.equal(find(testSelector('bookmark', 'bookmarked')).length, numberOfBookmarkedContents, 'Only bookmarked cards should be bookmarked');
    assert.equal(find(testSelector('bookmark-status', 'not-read')).length, numberOfBookmarkedContents, 'Not read bookmarks should show as unread');

    visit(`/feed/${contents[0].id}`);

    server.put('/users/:id/bookmarks/:id', function(db) {
      let attrs = this.normalizedRequestAttrs();
      assert.equal(attrs.read, true, 'Server gets request to change read status to true on detail view');
      done();

      const bookmark = db.bookmarks.find(attrs.id);
      return bookmark.update(attrs);
    });

    andThen(function() {
      assert.ok(trackingSpy.calledWith('ReadBookmark'), 'When bookmark status is changed to read, tracking event should fire');
      let $detailView = find(testSelector('content', contents[0].id));

      assert.equal($detailView.find(testSelector('bookmark-status', 'not-read')).length, 0, 'After detail view, unread bookmark should not show');
      assert.ok($detailView.find(testSelector('bookmark-status', 'read')).length, 'After detail view, read bookmark should show');
    });
  });
});
