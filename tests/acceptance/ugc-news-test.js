/* global FormData */
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import ugcNews from 'subtext-app/tests/pages/ugc-news';
import moment from 'moment';

module('Acceptance | ugc news', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Every field available filled in', async function(assert) {
    const done = assert.async(5);
    const location = this.server.create('location');
    const currentUser = this.server.create('current-user', {
      email: 'example@example.com',
    });
    currentUser.update({
      location: location
    });
    const title = 'Tatooine: On Moon Cycles';
    const subtitle = 'The definitive guide';
    const content = 'Due to multiple moons...';
    const today = moment().startOf('day');
    const tomorrow = today.add(1, 'days');

    // 12 pm in unix:
    const scheduleTime = "720";

    let currentAttrs = {
      contactEmail: null,
      contactPhone: null,
      content: null,
      contentType: "news",
      cost: null,
      eventUrl: null,
      locationId: location.id,
      publishedAt: null,
      schedules: [],
      sold: false,
      subtitle: null,
      title: title,
      url: null,
      venueId: null,
      venueStatus: null,
    };

    this.server.post('/contents', function(db) {
      const attrs = this.normalizedRequestAttrs();
      assert.deepEqual(attrs, currentAttrs, 'Server received POST data.');
      done();

      let mockData = {};
      Object.assign(mockData, {imageUrl: null, images: []}, attrs);

      delete mockData['schedules'];
      const content = db.create('content', mockData);

      return content;
    });

    this.server.post('/images', function({images}, request) {
      if(request.requestBody.constructor === FormData) {
        done();
        assert.ok(true, 'Uploaded the image');
      }
      return images.create();
    });

    this.server.put(`/contents/:id`, function({contents}, request) {
      const attrs = this.normalizedRequestAttrs();
      assert.deepEqual(attrs, currentAttrs, 'Server received PUT data.');
      done();

      let mockData = {};
      Object.assign(mockData, {imageUrl: null, images: []}, attrs);
      let content = contents.find(request.params.id);

      delete mockData['schedules'];

      content.update(mockData);
      return content;
    });

    this.server.get('/locations', function({locations}, request) {
      if ('query' in request.queryParams) {
        assert.ok(true, 'query sent to locations endpoint');
        done();
      }

      return locations.all();
    });


    authenticateUser(this.server, currentUser);

    await ugcNews.visit()
      .fillInTitle(title);

    currentAttrs.content = content;
    await ugcNews.fillInContent(content);


    currentAttrs.subtitle = subtitle;
    await ugcNews.fillInSubtitle(subtitle);

    await ugcNews.openFeaturedImage();
    await ugcNews.addImageFile();
    await ugcNews.submitImage();

    //POST on autosave after above ^^
    currentAttrs.id = "1";

    await ugcNews.selectNewLocation(get(location, 'id'));

    await ugcNews.pickToSchedule();
    await ugcNews.scheduleDate(tomorrow.format('x'));
    await ugcNews.scheduleTime(scheduleTime);

    currentAttrs.publishedAt = tomorrow.add(12, 'hours').utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

    await ugcNews.scheduleConfirm();
  });
});
