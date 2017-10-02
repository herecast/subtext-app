import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import mockLocationCookie from 'subtext-ui/tests/helpers/mock-location-cookie';

moduleForAcceptance('Acceptance | background index', {
  beforeEach() {
    mockLocationCookie(this.application);
  }
});

test('news show page, direct', function(assert) {
  const news1 = server.create('news');
  const newsAll = server.createList('news', 3).concat([news1]);

  visit('/');

  andThen(() => {
    visit(`/news/${news1.id}`);

    andThen(()=>{
      assert.equal(
        currentURL(),
        `/news/${news1.id}`);

      assert.equal(
        find(testSelector('component', 'news-detail')).length, 1,
        "Displays news detail");

      assert.equal(
        find(testSelector('page', 'location.news')).length, 1,
        "Displays location.news page in background");

      newsAll.forEach((item)=>{
        assert.ok(
          find(testSelector('news-card', item.title)).length,
          "News card for news item is visible");
      });
    });
  });
});

test('event show page, direct', function(assert) {
  const event1 = server.create('event-instance');

  visit(`/events/${event1.id}`);

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/events/${event1.id}`);

    assert.equal(
      find(testSelector('component', 'event-detail')).length, 1,
      "Displays event detail");

    assert.equal(
      find(testSelector('page', 'location.events')).length, 1,
      "Displays location.events page in background");
  });
});

test('talk show page, direct', function(assert) {
  authenticateUser(this.application, server);
  const talk1 = server.create('talk');
  const talkAll = server.createList('talk', 3).concat([talk1]);

  visit(`/talk/${talk1.id}`);

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/talk/${talk1.id}`);

    assert.equal(
      find(testSelector('component', 'talk-detail')).length, 1,
      "Displays talk detail");

    assert.equal(
      find(testSelector('page', 'location.talk')).length, 1,
      "Displays location.talk page in background");

    talkAll.forEach((item)=>{
      assert.ok(
        find(testSelector('talk-card', item.id)).length,
        "Talk card for talk item is visible");
    });
  });
});

test('market show page, direct', function(assert) {
  const market1 = server.create('market-post');

  visit(`/market/${market1.id}`);

  andThen(()=>{
    assert.equal(
      currentURL(),
      `/market/${market1.id}`);

    assert.equal(
      find(testSelector('component', 'market-detail')).length, 1,
      "Displays market detail");

    assert.equal(
      find(testSelector('page', 'location.market')).length, 1,
      "Displays location.market page in background");
  });
});

/*
test('news, preserved scroll position', function(assert) {
  const location = server.create('location');
  const news = server.createList('news', 12);
  let scrollPos = 0;

  visit(`/${location.id}/news`);

  andThen(()=> {
    const $newsItem = find(testSelector('news-card', news[7].title));
    $(window).scrollTop($newsItem.offset().top);

    scrollPos = window.scrollY;

    click(
      testSelector('link', 'show'),
      $newsItem
    );
  });

  andThen(()=> {
    assert.equal(
      window.scrollY,
      0);

    click(testSelector('link', 'close-detail-page'));
  });

  andThen(()=> {
    assert.equal(
      currentURL(),
      `/${location.id}/news`);

    assert.equal(
      window.scrollY,
      scrollPos,
      "Closing detail page, sets scroll back to original");
  });
});

test('events, preserved scroll position');

test('talk, preserved scroll position');

test('market, preserved scroll position');
*/
