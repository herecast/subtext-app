import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import testSelector from 'ember-test-selectors';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import moment from 'moment';

moduleForAcceptance('Acceptance | cards');

test('testing news card', function(assert) {
  const imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240';

  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'news',
    title: 'hello world',
    images: [{
      id: 1,
      image_url: imageUrl,
      primary: 1
    }],
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-image')).css('background-image'), `url(\"${imageUrl}\")`, 'it should show the card image');
    assert.equal(find(testSelector('card-excerpt')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find(testSelector('card-continue-reading')).length, 'it should show the continue reading link');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing talk card - with image', function(assert) {
  const imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240';
  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'talk',
    title: 'hello world',
    images: [{
      id: 1,
      image_url: imageUrl,
      primary: 1
    }]
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-image')).css('background-image'), `url(\"${imageUrl}\")`, 'it should show the card image');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing talk card - without image', function(assert) {
  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'talk',
    title: 'hello world',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: null,
    images: []
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-excerpt')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find(testSelector('card-continue-reading')).length, 'it should show the continue reading link');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});


test('testing - listserv content - without image, not logged in', function(assert) {
  const content = server.create('content', {
    contentOrigin: 'listserv',
    contentType: 'talk',
    title: 'hello world',
    imageUrl: null,
    images: []
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.ok(find(testSelector('card-fake-news')).length, 'it should show the lorem ipsum fake text');
    assert.ok(find(testSelector('card-login-to-view')).length, 'it should show the link to login to view');
  });
});

test('testing - listserv content - without image, logged in', function(assert) {
  authenticateUser(this.application, server);
  const content = server.create('content', {
    contentOrigin: 'listserv',
    contentType: 'talk',
    title: 'hello world',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    imageUrl: null,
    images: []
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-excerpt')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find(testSelector('card-continue-reading')).length, 'it should show the continue reading link');
  });
});

test('testing event card, with image', function(assert) {
  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'event',
    title: 'hello world',
    imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cost: 123,
    eventInstances: [],
    venueAddress: '15 Railroad Row',
    venueCity: 'White River Junction',
    venueState: 'VT'
  });

  const eventInstance = server.create('eventInstance', {
    contentId: content.id,
    startsAt: moment().add(1, 'hour').toISOString(),
    endsAt: moment().add(3, 'hours').toISOString(),
  });


  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  const {startsAt, endsAt} = eventInstance;
  const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;
  const eventDate = moment(startsAt).format('MMMM DD');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-event-date')).text().trim(), eventDate, 'it should show the correct event date');
    assert.equal(find(testSelector('card-event-time')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal(find(testSelector('card-event-price')).text().trim(), content.cost, 'it should show the correct event price');
    assert.equal(find(testSelector('directions-address')).text().trim(), content.venueAddress, 'it should show the correct event address');
    assert.equal(find(testSelector('directions-city-state')).text().trim(), `${content.venueCity}, ${content.venueState}`, 'it should show the event location');
    assert.equal(find(testSelector('card-image')).css('background-image'), `url(\"${content.imageUrl}\")`, 'it should show the card image');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing event card, without image', function(assert) {
  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'event',
    imageUrl: null,
    images: [],
    title: 'hello world',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis.',
    cost: 123,
    eventInstances: [],
    venueAddress: '15 Railroad Row',
    venueCity: 'White River Junction',
    venueState: 'VT'
  });

  const eventInstance = server.create('eventInstance', {
    contentId: content.id,
    startsAt: moment().add(1, 'hour').toISOString(),
    endsAt: moment().add(3, 'hours').toISOString(),
  });


  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  const {startsAt, endsAt} = eventInstance;
  const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;
  const eventDate = moment(startsAt).format('MMMM DD');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-event-date')).text().trim(), eventDate, 'it should show the correct event date');
    assert.equal(find(testSelector('card-event-time')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal(find(testSelector('card-event-price')).text(), content.cost, 'it should show the correct event price');
    assert.equal(find(testSelector('directions-address')).text().trim(), content.venueAddress, 'it should show the correct event address');
    assert.equal(find(testSelector('directions-city-state')).text().trim(), `${content.venueCity}, ${content.venueState}`, 'it should show the event location');
    assert.equal(find(testSelector('card-excerpt')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find(testSelector('card-continue-reading')).length, 'it should show the continue reading link');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});

test('testing market card', function(assert) {
  let user = server.create('current-user');

  authenticateUser(this.application, server, user);

  const content = server.create('content', {
    // contentOrigin required so listserv card isn't
    // selected at random
    contentOrigin: 'ugc',
    contentType: 'market',
    title: 'hello world',
    imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
    cost: 123
  });

  server.create('feedItem', {
    modelType: 'content',
    contentId: content.id
  });

  visit('/');

  andThen(function() {
    assert.equal(find(testSelector('card-title')).text().trim(), content.title, 'it should have the correct title');
    assert.equal(find(testSelector('card-image')).css('background-image'), `url(\"${content.imageUrl}\")`, 'it should show the card image');
    assert.equal(find(testSelector('card-market-cost')).text(), content.cost, 'it should show the correct market price');
    assert.ok(find(testSelector('card-market-thumbnail')).length, 'it should show the market thumbnail images');
    assert.ok(find(testSelector('card-attribution')).length, 'it should show the attribution');
    assert.ok(find(testSelector('comments-section')).length, 'it should show the comments section');
  });
});
