import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | news ugc', {
  beforeEach() {
    authenticateSession(this.application);
    this.location = server.create('location');
  }
});

test('/{location.id}/news while not logged in', function(assert) {
  assert.expect(1);

  invalidateSession(this.application);
  server.create('organization', { canPublishNews: true });
  const newsItem = server.create('news');

  visit(`${this.location.id}/news/${newsItem.id}`);

  andThen(() => {
    assert.equal(find(testSelector('field', 'new-comment')).length, 0, 'it should not have a comment form');
  });
});

test('/{location.id}/news', function(assert) {
  assert.expect(11);

  server.createList('news', 18);
  server.create('organization', { canPublishNews: true });

  const location = this.location;
  visit(`/${location.id}/news`);

  andThen(() => {
    assert.equal(currentURL(), `/${location.id}/news`, 'it should have the correct url');
    assert.ok(find(testSelector('news-length', '13')), 'it should display the total number of news items on the page');
    assert.equal(find(testSelector('link', 'content-create-button')).length, 0, 'it should not show a content create button');
    assert.equal(find(testSelector('news-card')).length, 13, 'it should list news articles');
    assert.equal(find(testSelector('pagination-next')).length, 1, 'it should have pagination link to next page');
    assert.equal(find(testSelector('pagination-prev')).length, 0, 'it should not have a pagination link to the previous page');
  });

  click(testSelector('pagination-next'));

  andThen(() => {
    assert.equal(currentURL(), `/${location.id}/news?page=2`, 'it should be on the second page of results');
    assert.ok(find(testSelector('news-length', '5')), 'it should display the total number of news items on the page');
    assert.equal(find(testSelector('news-card')).length, 5, 'it should list the remaining news articles');
    assert.equal(find(testSelector('pagination-next')).length, 0, 'it should not have a pagination link to next page');
    assert.equal(find(testSelector('pagination-prev')).length, 1, 'it should have a pagination link to the previous page');
  });
});

test('api, location', function(assert) {
  const newsItemsLocation1 = server.createList('news', 3);
  const location1 = this.location;
  server.createList('news', 5);
  server.get('/news', function({news}, request) {
    const locationId = request.queryParams['location_id'];

    assert.equal(locationId, location1.id,
      "passes location_id to api");

    if(locationId === location1.id) {
      return news.find(newsItemsLocation1.mapBy('id'));
    } else {
      return news.all();
    }
  });

  visit(`/${location1.id}/news`);

  andThen(()=>{
    assert.equal(
      find(testSelector('news-card')).length, newsItemsLocation1.length,
      "Displays news for the location"
    );

    newsItemsLocation1.forEach((item) => {
      assert.equal(
        find(testSelector('news-card', item.title)).length, 1);
    });
  });
});

test('/{location.id}/news cards link to full articles', function(assert) {
  assert.expect(3);

  server.create('organization', { canPublishNews: true });

  const news = server.create('news', { title: 'my fake news article', id: 50 });

  const location = this.location;
  visit(`/${location.id}/news`);

  andThen(() => {
    assert.equal(currentURL(), `/${location.id}/news`);
    assert.equal(find(testSelector('news-card')).length, 1, 'it should have one news article');
  });

  click(
    testSelector('link', 'show'),
    testSelector('news-card', news.title));

  andThen(() => {
    assert.equal(currentURL(), '/news/50', 'i can click the card title to view the full article');
  });
});

test('/news/:id commenting as a logged in user', function(assert) {
  assert.expect(5);
  mockLocationCookie(this.application);
  
  server.create('organization', { canPublishNews: true });

  const news = server.create('news', {
    id: 50,
    contentId: 50,
    title: 'my fake news article',
    commentCount: 8,
    authorName: 'Barry Manilow'
  });

  const comments = server.createList('comment', 8, {
    contentId: news.contentId
  });

  visit('/news/50');

  andThen(() => {
    assert.equal(currentURL(), '/news/50', 'it should be at the url for "/news/50"');
    assert.equal(find(testSelector('news-title')).text(), news.title, 'it should show the title');
    assert.equal(find(testSelector('author-name')).first().text().trim(), news.authorName, "it should show the author's name");
    assert.equal(find(testSelector('content-comment')).length, comments.length, 'it should show a count of 8 comments');
  });

  fillIn(testSelector('field', 'new-comment'), 'foobar');
  click(testSelector('component', 'add-comment-button'));

  andThen(() => {
    assert.equal(find(testSelector('content-comment')).length, comments.length + 1, 'it should show a count of 9 comments');
  });
});

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
