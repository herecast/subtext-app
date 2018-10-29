import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import moment from 'moment';
import { visit, find } from '@ember/test-helpers';

module('Acceptance | cards', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('testing news card', async function(assert) {
    const imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240';

    const content = this.server.create('content', {
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

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.equal($(find('[data-test-card-excerpt]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find('[data-test-card-continue-reading]'), 'it should show the continue reading link');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing talk card - with image', async function(assert) {
    //talk removed, but some legacy may remain - shifted to market until no contentTypes left
    const imageUrl = 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240';
    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'talk',
      title: 'hello world',
      images: [{
        id: 1,
        image_url: imageUrl,
        primary: 1
      }]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing talk card - without image', async function(assert) {
    //talk removed, but some legacy may remain - shifted to market until no contentTypes left
    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'talk',
      title: 'hello world',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: null,
      images: []
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-excerpt]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find('[data-test-card-continue-reading]'), 'it should show the continue reading link');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });


  test('testing event card, with image', async function(assert) {
    const content = this.server.create('content', {
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

    const someDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const eventInstance = this.server.create('eventInstance', {
      contentId: content.id,
      startsAt: moment(someDate).add(1, 'hour').toISOString(),
      endsAt: moment(someDate).add(3, 'hours').toISOString(),
    });

    content.update({
      eventInstances: [eventInstance]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    const {startsAt, endsAt} = eventInstance;
    const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;
    const eventDate = moment(startsAt).format('MMMM DD');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-event-date]')).text().trim(), eventDate, 'it should show the correct event date');
    assert.equal($(find('[data-test-card-event-time]')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal($(find('[data-test-card-event-price]')).text().trim(), content.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-directions-address]')).text().trim(), content.venueAddress, 'it should show the correct event address');
    assert.equal($(find('[data-test-directions-city-state]')).text().trim(), `${content.venueCity}, ${content.venueState}`, 'it should show the event location');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing event card, without image', async function(assert) {
    const content = this.server.create('content', {
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

    const someDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const eventInstance = this.server.create('eventInstance', {
      contentId: content.id,
      startsAt: moment(someDate).add(1, 'hour').toISOString(),
      endsAt: moment(someDate).add(3, 'hours').toISOString(),
    });

    content.update({
      eventInstances: [eventInstance]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    const {startsAt, endsAt} = eventInstance;
    const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;
    const eventDate = moment(startsAt).format('MMMM DD');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-event-date]')).text().trim(), eventDate, 'it should show the correct event date');
    assert.equal($(find('[data-test-card-event-time]')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal($(find('[data-test-card-event-price]')).text(), content.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-directions-address]')).text().trim(), content.venueAddress, 'it should show the correct event address');
    assert.equal($(find('[data-test-directions-city-state]')).text().trim(), `${content.venueCity}, ${content.venueState}`, 'it should show the event location');
    assert.equal($(find('[data-test-card-excerpt]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the card excerpt');
    assert.ok(find('[data-test-card-continue-reading]'), 'it should show the continue reading link');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing market card', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240',
      cost: 123
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.equal($(find('[data-test-card-market-cost]')).text(), content.cost, 'it should show the correct market price');
    assert.ok(find('[data-test-card-market-thumbnail]'), 'it should show the market thumbnail images');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });
});
