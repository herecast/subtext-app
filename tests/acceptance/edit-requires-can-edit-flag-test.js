import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'subtext-ui/tests/helpers/ember-test-selectors';

moduleForAcceptance('Acceptance | edit requires canEdit flag', {
  beforeEach() {
    window.Intercom = function() {
    };
    server.create('current-user');
    server.create('location');
    visit('/sign_in');
    click(testSelector('component', 'login-submit'));
  }
});

/* NEWS */
test('visit edit news page when not allowed to edit', function(assert) {
  const organization = server.create('organization');
  const news = server.create('news', {
    organization: organization,
    canEdit: false
  });

  let newsUrl = `/news/${news.id}/edit`;
  visit(newsUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'NewsEditor')).length,
      "should not see news editor");
  });
});

test('visit edit news page when allowed to edit', function(assert) {
  const organization = server.create('organization');
  const news = server.create('news', {
    organization: organization,
    canEdit: true
  });

  let newsUrl = `/news/${news.id}/edit`;
  visit(newsUrl).then(()=> {
    assert.ok(find(testSelector('component', 'NewsEditor')).length,
      "should see news editor");
  });
});

/* MARKET */
test('visit edit market page when not allowed to edit', function(assert) {
  const post = server.create('marketPost', {
    canEdit: false
  });

  let postUrl = `/market/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'MarketForm')).length,
      "should not see market form");
  });
});

test('visit edit market page when allowed to edit', function(assert) {
  const post = server.create('marketPost', {
    canEdit: true
  });

  let postUrl = `/market/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.ok(find(testSelector('component', 'MarketForm')).length,
      "should see market form");
  });
});

/* EVENTS */
test('visit edit event page when not allowed to edit', function(assert) {
  const post = server.create('event', {
    canEdit: false
  });

  let postUrl = `/events/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'EventForm')).length,
      "should not see event form");
  });
});

test('visit edit event page when allowed to edit', function(assert) {
  const post = server.create('event', {
    canEdit: true
  });

  let postUrl = `/events/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.ok(find(testSelector('component', 'EventForm')).length,
      "should see event form");
  });
});

/* TALK */
/* Edit disabled anyway...
test('visit edit talk page when not allowed to edit', function(assert) {
  const post = server.create('talk', {
    canEdit: false
  });

  let postUrl = `/talk/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.notOk(find(testSelector('component', 'TalkForm')).length,
      "should not see talk form");
  });
});

test('visit edit talk page when allowed to edit', function(assert) {
  const post = server.create('talk', {
    canEdit: true
  });

  let postUrl = `/talk/${post.id}/edit`;
  visit(postUrl).then(()=> {
    assert.ok(find(testSelector('component', 'TalkForm')).length,
      "should see talk form");
  });
});
*/
