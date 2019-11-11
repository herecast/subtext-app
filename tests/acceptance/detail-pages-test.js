import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import { invalidateSession} from 'ember-simple-auth/test-support';
import mockCookies from 'subtext-app/tests/helpers/mock-cookies';
import moment from 'moment';
import { visit, find } from '@ember/test-helpers';

module('Acceptance | detail pages', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    invalidateSession();
    mockCookies({});
  });

  test('testing news detail page, logged out', async function(assert) {
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
    assert.ok(find(`[data-test-loading-image-url="${content.imageUrl}"]`), 'it should show the detail page image');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-detail-page-caster-footer]'), 'it should show the caster footer');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing news detail page, logged in, not content owner', async function(assert) {
    const currentUser = this.server.create('caster');
    authenticateUser(this.server, currentUser);

    const splitContent = {
      head: "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox ",
      tail: "Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };

    const otherCaster = this.server.create('caster');

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x240.png?text=400x240',
      splitContent: splitContent,
      content: splitContent.head + ' ' + splitContent.tail,
      caster: otherCaster
    });

    await visit(`/${content.id}`);

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.ok(find(`[data-test-loading-image-url="${content.imageUrl}"]`), 'it should show the detail page image');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-detail-page-caster-footer]'), 'it should show the caster footer');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing news detail page, logged in, is content owner', async function(assert) {
    const currentUser = this.server.create('caster');
    authenticateUser(this.server, currentUser);

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
      content: splitContent.head + ' ' + splitContent.tail,
      caster: currentUser
    });

    await visit(`/${content.id}`);

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.ok(find(`[data-test-loading-image-url="${content.imageUrl}"]`), 'it should show the detail page image');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-detail-page-caster-footer]'), 'it should show the caster footer');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing event detail page', async function(assert) {
    const splitContent = {
      head: "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox ",
      tail: "Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };

    const eventInstance = this.server.create('event-instance', {
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00"
    });

    const content = this.server.create('content', {
      contentType: 'event',
      title: 'hello world',
      images: [
        {id:1, primary: true, imageUrl:'https://via.placeholder.com/400x240.png?text=400x240'}
      ],
      splitContent: splitContent,
      content: splitContent.head + ' ' + splitContent.tail,
      startsAt: "2018-01-30T21:19:17+00:00",
      endsAt: "2018-01-30T21:22:17+00:00",
      cost: 123,
      url: 'httx://test.test',
      venueName: 'Hotel Fun',
      venueAddress: '15 Railroad Row',
      venueCity: 'White River Junction',
      venueState: 'VT'
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    content.update({
      eventInstances: [eventInstance]
    });

    await visit(`/${content.id}/${eventInstance.id}`);

    const {startsAt, endsAt} = eventInstance;
    const eventTime = `${moment(startsAt).format('h:mm A')} ${String.fromCharCode(0x2014)} ${moment(endsAt).format('h:mm A')}`;

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-detail-meta-time]')).text().trim(), eventTime, 'it should show the correct event time');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.equal($(find('[data-test-detail-meta-cost]')).text().trim(), content.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-detail-meta-url]')).text().trim(), content.url, 'it should show the correct event url');
    assert.equal($(find('[data-test-detail-meta-venue-address]')).first().text().trim(), content.venueAddress, 'it should show the correct event address');
    assert.equal($(find('[data-test-detail-meta-venue-name]')).first().text().trim(), content.venueName, 'it should show the event name');
    assert.equal($(find('[data-test-header-image]')).css('background-image'), `url("${content.images[0].imageUrl}")`, 'it should show the event image');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-detail-page-caster-footer]'), 'it should show the caster footer');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing market detail page', async function(assert) {
    const splitContent = {
      head: "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox ",
      tail: "Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    };

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
      splitContent: splitContent,
      content: splitContent.head + ' ' + splitContent.tail,
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
    assert.equal($(find('[data-test-detail-meta-cost]')).text().trim(), content.cost, 'it should show the correct market price');
    assert.equal($(find('[data-test-card-location]')).text().trim(), location.city, 'it should show the correct market location');
    assert.equal($(find('[data-test-detail-page-content]')).text().trim().substring(0, 50), content.content.substring(0, 50), 'it should show the detail page content');
    assert.ok(find('[data-test-detail-page-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-detail-page-caster-footer]'), 'it should show the caster footer');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });

  test('testing deleted content detail page', async function(assert) {
    const comments = this.server.createList('comment', 3);

    const content = this.server.create('content', {
      deleted: true,
      contentOrigin: null,
      contentType: null,
      title: null,
      imageUrl: null,
      content: null,
      comments
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit(`/${content.id}`);

    assert.ok(find('[data-test-component="detail-page-dead-page"]'), 'it should show the dead page for deleted content');
    assert.ok(find('[data-test-comments-section]'), 'it should show the comments section');
  });
});
