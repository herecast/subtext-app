import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import moment from 'moment';
import { visit, find } from '@ember/test-helpers';

module('Acceptance | cards', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('testing news card - with image', async function(assert) {
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
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
  });

  test('testing news card - without image', async function(assert) {
    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'news',
      title: 'hello world',
      images: [],
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus pharetra convallis. Maecenas sed elementum neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.ok($(find('[data-test-card-image-placeholder]')), 'it should show the card image placeholder');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
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
  });

  test('testing event card, with single date', async function(assert) {
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

    content.update({
      images: [
        {id: 1, image_url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240', primary: true}
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

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-price]')).text().trim(), content.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-card-start-date]'), 'it should show the single date indicator');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
  });

  test('testing event card, with multiple dates and images', async function(assert) {
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

    content.update({
      images: [
        {id: 1, image_url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240', primary: true},
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

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-price]')).text().trim(), content.cost, 'it should show the correct event price');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.ok(find('[data-test-card-start-date-multiple]'), 'it should show the multiple dates indicator');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');

  });

  test('testing market card with one image', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240'
    });

    content.update({
      images: [
        {id: 1, image_url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240', primary: true}
      ]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.notOk(find('[data-test-card-multiple-images]'), 'it should not show the multiple images symbol');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
  });

  test('testing market card with multiple images', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240'
    });

    content.update({
      images: [
        {id: 1, image_url: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240', primary: true},
        {id: 2, image_url: 'http://notblank.com/image.jpg', primary: false}
      ]
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.equal($(find('[data-test-card-image]')).css('background-image'), `url("${content.imageUrl}")`, 'it should show the card image');
    assert.ok(find('[data-test-card-multiple-images]'), 'it should show the multiple images symbol');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
  });

  test('testing market card with no images', async function(assert) {

    const content = this.server.create('content', {
      contentOrigin: 'ugc',
      contentType: 'market',
      title: 'hello world',
      imageUrl: 'http://placeholdit.imgix.net/~text?txtsize=33&txt=400%C3%97240&w=400&h=240'
    });

    content.update({
      images: []
    });

    this.server.create('feedItem', {
      modelType: 'content',
      contentId: content.id
    });

    await visit('/');

    assert.equal($(find('[data-test-card-title]')).text().trim(), content.title, 'it should have the correct title');
    assert.ok($(find('[data-test-card-image-placeholder]')), 'it should show the card image placeholder');
    assert.ok(find('[data-test-card-attribution]'), 'it should show the attribution');
  });

});
