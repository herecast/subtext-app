/* global FormData */
import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcNews from 'subtext-ui/tests/pages/ugc-news';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import Ember from 'ember';
import moment from 'moment';
const { get } = Ember;

moduleForAcceptance('Acceptance | ugc news');

test('Every field available filled in', function(assert) {
  const done = assert.async(7);
  const organization = server.create('organization', {can_publish_news: true});
  const currentUser = server.create('current-user', { email: 'example@example.com' });
  currentUser.managedOrganizationIds = [parseInt(get(organization, 'id'))];

  const title = 'Tatooine: On Moon Cycles';
  const subtitle = 'The definitive guide';
  const content = 'Due to multiple moons...';
  const author = 'Ben Kenobi';
  const scheduleDate = moment().startOf('day').add(1, 'days');
  // 12 pm in unix:
  const scheduleTime = "720";

  let currentAttrs = {
    authorName: currentUser.name,
    bizFeedPublic: null,
    contactEmail: null,
    contactPhone: null,
    content: null,
    contentType: "news",
    cost: null,
    costType: null,
    eventUrl: null,
    listservIds: [],
    organizationId: organization.id,
    promoteRadius: null,
    publishedAt: null,
    registrationDeadline: null,
    schedules: [],
    sold: false,
    subtitle: null,
    sunsetDate: null,
    title: title,
    locationId: null,
    ugcJob: null,
    venueId: null,
    venueStatus: null,
    wantsToAdvertise: false
  };

  server.post('/contents', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.deepEqual(attrs, currentAttrs, 'Server received POST data.');
    done();
    let mockData = {};
    Object.assign(mockData, {imageUrl: null, images: []}, attrs);

    delete mockData['schedules'];
    const content = server.create('content', mockData);

    return content;
  });

  server.post('/images', function({images}, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return images.create();
  });

  server.put(`/contents/:id`, function({contents}, request) {
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

  Ember.run(() => {
    authenticateUser(this.application, server, currentUser);

    ugcNews.visit();
    ugcNews.fillInTitle(title);

    andThen(() => {
      currentAttrs.subtitle = subtitle;
      currentAttrs.id = "1";
      return ugcNews.fillInSubtitle(subtitle);
    });

    andThen(() => {
      currentAttrs.content = content;
      return ugcNews.fillInContent(content);
    });

    andThen(() => {
      return ugcNews.startOverrideAuthor();
    });

    andThen(() => {
      currentAttrs.authorName = author;
      return ugcNews.overrideAuthor(author);
    });

    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = 'twoMoons.jpg';
        Ember.run(()=>{
          ugcNews.fillInImage(file);
        });
      });
    });

    ugcNews.pickToSchedule();
    ugcNews.scheduleDate(scheduleDate.subtract(12, 'hours').format('x'));
    ugcNews.scheduleTime(scheduleTime);

    andThen(() => {
      currentAttrs.publishedAt = scheduleDate.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    });

    andThen(()=>{
      ugcNews.scheduleConfirm();
    });
  });
});
