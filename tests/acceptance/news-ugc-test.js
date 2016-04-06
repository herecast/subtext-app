import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'subtext-ui/tests/helpers/ember-simple-auth';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';
// import { server } from 'ember-cli-mirage';

moduleForAcceptance('Acceptance | news ugc', {
  beforeEach() {
    authenticateSession(this.application);
  }
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
