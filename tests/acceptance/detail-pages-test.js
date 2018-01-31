import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import moment from 'moment';

moduleForAcceptance('Acceptance | detail pages');

test('testing news detail page', function(assert) {
  const splitContent = {
    head: "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox ",
    tail: "Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  };

  const feedContent = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'news',
    title: 'hello world',
    imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
    splitContent: splitContent,
    content: splitContent.head + ' ' + splitContent.tail
  });

  server.create('feedItem', {
    modelType: 'feedContent',
    feedContentId: feedContent.id
  });

  visit(`/feed/${feedContent.id}`);

  andThen(function() {
    assert.equal(find(testSelector('news-title')).text().trim(), feedContent.title, 'it should have the correct title');
    assert.equal(find(testSelector('detail-page-image')).attr('src'), feedContent.imageUrl, 'it should show the detail page image');
    assert.equal(find(testSelector('detail-page-content')).text().trim().substring(0, 50), feedContent.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find(testSelector('link', 'organization-link')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing talk detail page', function(assert) {
  let user = server.create('user');
  authenticateUser(this.application, server, user);

  const feedContent = server.create('feedContent', {
    contentType: 'talk',
    title: 'hello world',
    imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });

  server.create('feedItem', {
    modelType: 'feedContent',
    feedContentId: feedContent.id
  });

  visit(`/feed/${feedContent.id}`);

  andThen(function() {
    assert.equal(find(testSelector('talk-title')).text().trim(), feedContent.title, 'it should have the correct title');
    assert.equal(find(testSelector('component', 'header-image')).css('background-image'), `url(\"${feedContent.imageUrl}\")`, 'it should show the card image');
    assert.equal(find(testSelector('talk-content')).text().trim().substring(0, 50), feedContent.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find(testSelector('talk-author-name')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing event detail page', function(assert) {
  const eventInstance = server.create('eventInstance', {
    costType: 'paid',
    title: 'hello world',
    imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    startsAt: "2018-01-30T21:19:17+00:00",
    endsAt: "2018-01-30T21:22:17+00:00",
    cost: 123,
    venueAddress: '15 Railroad Row',
    venueCity: 'White River Junction',
    venueState: 'VT'
  });
  const feedContent = server.create('feedContent', {
    contentType: 'event',
  });

  server.create('feedItem', {
    modelType: 'feedContent',
    feedContentId: feedContent.id
  });

  visit(`/feed/${feedContent.id}/${eventInstance.id}`);

  const {startsAt, endsAt} = eventInstance;
  const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;

  andThen(function() {
    assert.equal(find(testSelector('event-detail-title')).text().trim(), eventInstance.title, 'it should have the correct title');
    assert.equal(find(testSelector('event-detail-timeRange')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal(find(testSelector('event-detail-cost')).text().trim(), eventInstance.cost, 'it should show the correct event price');
    assert.equal(find(testSelector('directions-address')).first().text().trim(), eventInstance.venueAddress, 'it should show the correct event address');
    assert.equal(find(testSelector('directions-city-state')).first().text().trim(), `${eventInstance.venueCity}, ${eventInstance.venueState}`, 'it should show the event location');
    assert.equal(find(testSelector('component', 'header-image')).css('background-image'), `url(\"${feedContent.imageUrl}\")`, 'it should show the card image');
    assert.ok(find(testSelector('event-detail-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing market detail page', function(assert) {
  let user = server.create('user');
  authenticateUser(this.application, server, user);

  const imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240';
  const feedContent = server.create('feedContent', {
    contentOrigin: 'ugc',
    contentType: 'market',
    title: 'hello world',
    imageUrl: null,
    images: [{
      id: 1,
      image_url: imageUrl,
      primary: 1
    },{
      id: 2,
      image_url: imageUrl,
      primary: 0
    }],
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cost: 123
  });

  server.create('feedItem', {
    modelType: 'feedContent',
    feedContentId: feedContent.id
  });

  visit(`/feed/${feedContent.id}`);

  andThen(function() {
    assert.equal(find(testSelector('market-title')).text().trim(), feedContent.title, 'it should have the correct title');
    assert.equal(find(testSelector('component', 'header-image')).css('background-image'), `url(\"${imageUrl}\")`, 'it should show the card image');
    assert.ok(find(testSelector('market-thumbnail')).length, 'it should show the market thumbnail images');
    assert.equal(find(testSelector('market-price')).text(), feedContent.cost, 'it should show the correct market price');
    assert.equal(find(testSelector('market-content')).text().trim().substring(0, 50), feedContent.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find(testSelector('market-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});