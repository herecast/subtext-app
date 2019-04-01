import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import moment from 'moment';
import { visit, find } from '@ember/test-helpers';

module('Acceptance | detail pages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('testing news detail page', async function(assert) {
    const splitContent = {
      head: "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox ",
      tail: "Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x240.png?text=400x240',
      splitContent: splitContent,
      content: splitContent.head + ' ' + splitContent.tail
    });

    await visit(`/${content.id}`);

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-detail-page-image]')).attr('src'), content.imageUrl, 'it should show the detail page image');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing talk detail page', async function(assert) {
    //talk removed, but some legacy may remain - shifted to market until no contentTypes left
    const content = this.server.create('content', {
      contentType: 'talk',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x240.png?text=400x240',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit(`/${content.id}`);

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-header-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.equal($(find('[data-test-market-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-market-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing event detail page', async function(assert) {
    const eventInstance = this.server.create('eventInstance', {
      title: 'hello world',
      images: [
        {id:1, primary: true, imageUrl:'https://via.placeholder.com/400x240.png?text=400x240'}
      ],
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00",
      cost: 123,
      url: 'httx://test.test',
      venueName: 'Hotel Fun',
      venueAddress: '15 Railroad Row',
      venueCity: 'White River Junction',
      venueState: 'VT'
    });
    const content = this.server.create('content', {
      contentType: 'event',
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit(`/${content.id}/${eventInstance.id}`);

    const {startsAt, endsAt} = eventInstance;
    const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;

    assert.equal($(find('[data-test-card-title]')).text().trim(), eventInstance.title, 'it should have the correct title');
    assert.equal($(find('[data-test-detail-meta-time]')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal($(find('[data-test-detail-meta-cost]')).text().trim(), eventInstance.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-detail-meta-url]')).text().trim(), eventInstance.url, 'it should show the correct event url');
    assert.equal($(find('[data-test-detail-meta-venue-address]')).first().text().trim(), eventInstance.venueAddress, 'it should show the correct event address');
    assert.equal($(find('[data-test-detail-meta-venue-name]')).first().text().trim(), eventInstance.venueName, 'it should show the event name');
    assert.equal($(find('[data-test-header-image]')).css('background-image'), `url("${eventInstance.images[0].imageUrl}")`, 'it should show the event image');
    assert.ok(find('[data-test-event-detail-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing market detail page', async function(assert) {
    const imageUrl = 'https://via.placeholder.com/400x240.png?text=400x240';
    const location = this.server.create('location');
    const content = this.server.create('content', {
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
      cost: 123,
      locationId: location.id,
      embeddedAd: false
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit(`/${content.id}`);

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-header-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-image-thumbnail]'), 'it should show the market thumbnail images');
    assert.equal($(find('[data-test-detail-meta-cost]')).text(), content.cost, 'it should show the correct market cost');
    assert.equal($(find('[data-test-card-location]')).text().trim(), [location.city, location.state].join(', '), 'it should show the correct market location');
    assert.equal($(find('[data-test-market-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-market-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });
});
