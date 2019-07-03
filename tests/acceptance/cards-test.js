import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import mockLocationCookie from 'subtext-app/tests/helpers/mock-location-cookie';
import loadPioneerFeed from 'subtext-app/tests/helpers/load-pioneer-feed';
import moment from 'moment';
import { visit, find, click } from '@ember/test-helpers';

const imageUrl = 'https://via.placeholder.com/400x200.png?text=400x240';

module('Acceptance | cards', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    mockLocationCookie(this.server);
    loadPioneerFeed(false);
  });

  test('testing news card', async function(assert) {
    const organization = this.server.create('organization', {
      activeSubscriberCount: 100
    });

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      title: 'hello world',
      organizationId: organization.id,
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

    await click('[data-test-card-size-chooser="fullsize"]');

    assert.ok(find('[data-test-fullsize-card]'), 'should show the fullsize card');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-subscriber-count]'), 'it should show the subscriber count');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="midsize"]');

    assert.ok(find('[data-test-midsize-card]'), 'should show the midsize card');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-subscriber-count]'), 'it should show the subscriber count');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="compact"]');

    assert.ok(find('[data-test-compact-card]'), 'should show the compact card');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-button="bookmark-icon"]'), 'it should NOT show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.notOk(find('[data-test-card-subscriber-count]'), 'it should NOT show the subscriber count');
    assert.notOk(find('[data-test-card-options-menu]'), 'it should NOT show the options menu');
  });

  test('testing event card, with single date', async function(assert) {
    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=400x240',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      cost: 123,
      eventInstances: [],
      venueAddress: '15 Railroad Row',
      venueCity: 'White River Junction',
      venueState: 'VT'
    });

    content.update({
      images: [
        {id: 1, image_url: 'https://via.placeholder.com/400x200.png?text=400x240', primary: true}
      ]
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

    await click('[data-test-card-size-chooser="fullsize"]');

    assert.ok(find('[data-test-fullsize-card]'), 'should show the fullsize card');
    assert.ok(find('[data-test-card-start-date]'), 'it should show the single date indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="midsize"]');

    assert.ok(find('[data-test-midsize-card]'), 'should show the midsize card');
    assert.ok(find('[data-test-card-start-date]'), 'it should show the single date indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="compact"]');

    assert.ok(find('[data-test-compact-card]'), 'should show the compact card');
    assert.ok(find('[data-test-card-start-date]'), 'it should show the single date indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-button="bookmark-icon"]'), 'it should NOT show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.notOk(find('[data-test-card-options-menu]'), 'it should NOT show the options menu');
  });

  test('testing event card, with multiple dates and images', async function(assert) {
    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'event',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=400x240',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      cost: 123,
      eventInstances: [],
      venueAddress: '15 Railroad Row',
      venueCity: 'White River Junction',
      venueState: 'VT'
    });

    content.update({
      images: [
        {id: 1, image_url: 'https://via.placeholder.com/400x200.png?text=400x240', primary: true},
        {id: 2, image_url: 'http://notblank.com/image.jpg', primary: false}
      ]
    });

    const someDate = moment().add(1, 'day').format('YYYY-MM-DD');
    const eventInstance1 = this.server.create('eventInstance', {
      contentId: content.id,
      startsAt: moment(someDate).add(1, 'hour').toISOString(),
      endsAt: moment(someDate).add(3, 'hours').toISOString(),
    });

    const someOtherDate = moment().add(2, 'day').format('YYYY-MM-DD');
    const eventInstance2 = this.server.create('eventInstance', {
      contentId: content.id,
      startsAt: moment(someOtherDate).add(1, 'hour').toISOString(),
      endsAt: moment(someOtherDate).add(3, 'hours').toISOString(),
    });

    content.update({
      eventInstances: [eventInstance1, eventInstance2]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    await click('[data-test-card-size-chooser="fullsize"]');

    assert.ok(find('[data-test-fullsize-card]'), 'should show the fullsize card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.ok(find('[data-test-card-start-date-multiple]'), 'it should show the multiple dates indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="midsize"]');

    assert.ok(find('[data-test-midsize-card]'), 'should show the midsize card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.ok(find('[data-test-card-start-date-multiple]'), 'it should show the multiple dates indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="compact"]');

    assert.ok(find('[data-test-compact-card]'), 'should show the compact card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.ok(find('[data-test-card-start-date-multiple]'), 'it should show the multiple dates indicator');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-button="bookmark-icon"]'), 'it should NOT show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.notOk(find('[data-test-card-options-menu]'), 'it should NOT show the options menu');
  });

  test('testing market card with one image', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=400x240'
    });

    content.update({
      images: [
        {id: 1, image_url: 'https://via.placeholder.com/400x200.png?text=400x240', primary: true}
      ]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    await click('[data-test-card-size-chooser="fullsize"]');

    assert.ok(find('[data-test-fullsize-card]'), 'should show the fullsize card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="midsize"]');

    assert.ok(find('[data-test-midsize-card]'), 'should show the midsize card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="compact"]');

    assert.ok(find('[data-test-compact-card]'), 'should show the compact card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-button="bookmark-icon"]'), 'it should NOT show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.notOk(find('[data-test-card-options-menu]'), 'it should NOT show the options menu');
  });

  test('testing market card with multiple images', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=400x240'
    });

    content.update({
      images: [
        {id: 1, image_url: 'https://via.placeholder.com/400x200.png?text=400x240', primary: true},
        {id: 2, image_url: 'http://notblank.com/image.jpg', primary: false}
      ]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    await click('[data-test-card-size-chooser="fullsize"]');

    assert.ok(find('[data-test-fullsize-card]'), 'should show the fullsize card');
    assert.ok(find('[data-test-card-multiple-images]'), 'it should show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="midsize"]');

    assert.ok(find('[data-test-midsize-card]'), 'should show the midsize card');
    assert.ok(find('[data-test-card-multiple-images]'), 'it should show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-button="bookmark-icon"]'), 'it should show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.ok(find('[data-test-card-options-menu]'), 'it should show the options menu');

    await click('[data-test-card-size-chooser="compact"]');

    assert.ok(find('[data-test-compact-card]'), 'should show the compact card');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should Not show the multiple images symbol');
    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-button="bookmark-icon"]'), 'it should NOT show the bookmark button');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
    assert.notOk(find('[data-test-card-options-menu]'), 'it should NOT show the options menu');
  });

});
