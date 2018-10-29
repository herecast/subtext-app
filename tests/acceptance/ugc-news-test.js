/* global FormData */
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcNews from 'subtext-ui/tests/pages/ugc-news';
import moment from 'moment';

module('Acceptance | ugc news', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Every field available filled in', async function(assert) {
    const done = assert.async(9);
    const organization = this.server.create('organization', {can_publish_news: true});
    const location = this.server.create('location');
    const currentUser = this.server.create('current-user', {
      email: 'example@example.com',
      locationId: location.id,
      managedOrganizationIds: [organization.id]
    });
    const title = 'Tatooine: On Moon Cycles';
    const subtitle = 'The definitive guide';
    const content = 'Due to multiple moons...';
    const author = 'Ben Kenobi';
    const today = moment().startOf('day');
    const tomorrow = today.add(1, 'days');
    //const scheduleDate = moment().startOf('day').add(1, 'days');
    // 12 pm in unix:
    const scheduleTime = "720";

    let currentAttrs = {
      authorName: currentUser.name,
      bizFeedPublic: true,
      contactEmail: null,
      contactPhone: null,
      content: null,
      contentType: "news",
      cost: null,
      costType: null,
      eventUrl: null,
      listservIds: [],
      locationId: location.id,
      organizationId: organization.id,
      publishedAt: null,
      registrationDeadline: null,
      schedules: [],
      sold: false,
      subtitle: null,
      sunsetDate: null,
      title: title,
      venueId: null,
      venueStatus: null,
      wantsToAdvertise: false
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

    currentAttrs.subtitle = subtitle;
    currentAttrs.id = "1";
    await ugcNews.fillInSubtitle(subtitle);

    currentAttrs.content = content;
    await ugcNews.fillInContent(content);

    await ugcNews.selectNewLocation(get(location, 'id'));

    await ugcNews.startOverrideAuthor();
    currentAttrs.authorName = author;
    await ugcNews.overrideAuthor(author);

    await ugcNews.openFeaturedImage();
    await ugcNews.addImageFile();
    await ugcNews.submitImage();

    await ugcNews.pickToSchedule();

    await ugcNews.scheduleDate(tomorrow.format('x'));
    await ugcNews.scheduleTime(scheduleTime);

    currentAttrs.publishedAt = tomorrow.add(12, 'hours').utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

    await ugcNews.scheduleConfirm();

  });
});
