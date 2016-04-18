import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | news ugc', {
  beforeEach() {
    authenticateSession(this.application);
  }
});

test('/news while not logged in', function(assert) {
  invalidateSession(this.application);
  const newsItem = server.create('news');

  visit(`/news/${newsItem.id}`);

  andThen(() => {
    assert.equal(find(testSelector('component', 'new-comment')).length, 0, 'it should not have a comment form');
  });
});
/*
test('/news', function(assert) {
  server.createList('news', 20);

  visit('/news');

  andThen(() => {
    assert.equal(currentURL(), '/news', 'it should have the correct url');
    assert.ok(find(testSelector('news-length', '14')), 'it should display the total number of news items on the page');
    assert.equal(find(testSelector('link', 'content-create-button')).length, 0, 'it should not show a content create button');
    assert.equal(find(testSelector('news-card')).length, 14, 'it should list news articles');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should have pagination link to next page');
    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not have a pagination link to the previous page');
  });

  click(testSelector('pagination-next'));

  andThen(() => {
    assert.equal(currentURL(), '/news?page=2', 'it should be on the second page of results');
    assert.ok(find(testSelector('news-length', '6')), 'it should display the total number of news items on the page');
    assert.equal(find(testSelector('news-card')).length, 6, 'it should list the remaining news articles');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not have a pagination link to next page');
    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should have a pagination link to the previous page');
  });
});
*/
/*
test('/news cards link to full articles', function(assert) {
  const news = server.create('news', { title: 'my fake news article', id: 50 });

  visit('/news');

  andThen(() => {
    assert.equal(currentURL(), '/news');
    assert.equal(find(testSelector('news-card')).length, 1, 'it should have one news article');
  });

  click(testSelector('link', news.title));

  andThen(() => {
    assert.equal(currentURL(), '/news/50', 'i can click the card title to view the full article');
  });
});
*/
/*
test('/news/:id commenting as a logged in user', function(assert) {
  const news = server.create('news', {
    id: 50,
    content_id: 50,
    title: 'my fake news article',
    comment_count: 8,
    author_name: 'Barry Manilow'
  });
  const comments = server.createList('comment', 8, {
    content_id: news.content_id
  });

  visit('/news/50');

  andThen(() => {
    assert.equal(currentURL(), '/news/50', 'it should be at the url for "/news/50"');
    assert.equal(find(testSelector('news-title')).text(), news.title, 'it should show the title');
    assert.equal(find(testSelector('author-name')).first().text().trim(), news.author_name, "it should show the author's name");
    assert.equal(find(testSelector('content-comment')).length, comments.length, 'it should show a count of 8 comments');
  });

  fillIn(testSelector('component', 'new-comment'), 'foobar');
  click(testSelector('component', 'add-comment-button'));

  andThen(() => {
    assert.equal(find(testSelector('content-comment')).length, comments.length + 1, 'it should show a count of 9 comments');
  });
});
*/

// **can write acceptance tests for**
// i can change content status from draft to publish and publish to draft
// title and content body are required when publishing/re-publishing a post'
// my draft is auto-saved within a few seconds after I make changes'
// i can manage content status as draft (not live) and published (live)
// I can set the content's pubdate to a date in the future, delaying when it goes live

// **cannot write acceptance tests for — api responsibility**
// draft posts are not displayed on dUV index pages or as dUV suggested content
// content with pubdates in the future are not displayed on dUV index pages or as dUV suggested content

/*
test('I can create news from the news landing page', function(assert) {
  visit('/news');

  click(testSelector('create-content-btn'));

  andThen(() => {
    assert.equal(currentURL(), '/news/new', '');
  });
});

test('I can create content title, subtitle and content body', function(assert) {
  visit('/news/new');

  andThen(() => {
    assert.equal(currentURL(), '/news/new');
    assert.equal(find(testSelector('publish-status')).text().trim(), 'status: draft', 'my news editor should be in draft mode');
  });

  fillIn(testSelector('field', 'title'), 'This is the title');
  fillIn(testSelector('field', 'subtitle'), 'This is the subtitle');
  fillIn(testSelector('textarea', 'content'), 'This is the content');

  andThen(() => {
    assert.equal($(testSelector('autosave-indicator')).text().trim(), 'saved', 'content should be autosaved');
  });
});
*/
// 'I can edit content title, subtitle and content body'
