import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | talk/show', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('visiting /talk/:id', function(assert) {
  const talk = server.create('talk', {
    title: 'East Coast 4 life',
    content: 'Biggie Smalls was the illest',
    author_name: 'J-Mad',
    comment_count: 8
  });

  const comments = server.createList('comment', talk.comment_count, {
    content_id: talk.content_id
  });

  visit('/talk/1');

  andThen(function() {
    assert.equal(currentURL(), '/talk/1', 'it should be at the /talk/1 url');
    assert.equal(find(testSelector('talk-title')).text(), talk.title, 'it should show the title');
    assert.equal(find(testSelector('talk-content')).text(), talk.content, 'it should show the content');
    assert.equal(find(testSelector('talk-author-name')).first().text().trim(), talk.author_name, 'it should show the author\'s name');
    assert.equal(find(testSelector('comment-count')).first().text().trim(), talk.comment_count, 'it should show a count of 8 comments');
    assert.equal(find(testSelector('content-comment')).length, comments.length, 'it should show a count of 8 comments');
  });

  fillIn(testSelector('component', 'new-comment'), 'it was all a dream');
  click(testSelector('component', 'add-comment-button'));

  andThen(function() {
    assert.equal(currentURL(), '/talk/1', 'it should be at the /talk/1 url');
    assert.equal(find(testSelector('comment-count')).first().text().trim(), talk.comment_count + 1, 'it should show a count of 9 comments');
    assert.equal(find(testSelector('content-comment')).length, comments.length + 1, 'it should show a count of 9 comments');
  });
});
