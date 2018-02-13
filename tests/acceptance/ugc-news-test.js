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
  const done = assert.async(5);
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
    title: title,
    content: null,
    contentLocations: [],
    organizationId: organization.id,
    organizationName: null,
    promoteRadius: null,
    publishedAt: null,
    subtitle: null,
    ugcBaseLocationId: null
  };

  server.post('/news', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.deepEqual(attrs, currentAttrs, 'Server received POST data.');
    done();
    let mockData = {};
    Object.assign(mockData, currentAttrs, {image_url: null, images: []});
    return server.create('news', mockData);
  });

  server.post('/images', function(_, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return {};
  });

  server.put(`/news/:id`, function() {
    const attrs = this.normalizedRequestAttrs();
    assert.deepEqual(attrs, currentAttrs, 'Server received PUT data.');
    done();
    let mockData = {};
    Object.assign(mockData, currentAttrs, {image_url: null, images: []});
    return server.create('news', mockData);
  });

  Ember.run(() => {
    authenticateUser(this.application, server, currentUser);

    ugcNews.visit();
    ugcNews.fillInTitle(title);

    andThen(() => {
      currentAttrs.subtitle = subtitle;
      currentAttrs.id = "1";
      ugcNews.fillInSubtitle(subtitle);
    });

    andThen(() => {
      currentAttrs.content = content;
      ugcNews.fillInContent(content);
    });

    andThen(() => {
      ugcNews.startOverrideAuthor();
    });

    andThen(() => {
      currentAttrs.authorName = author;
      ugcNews.overrideAuthor(author);
    });

    andThen(() => {
      currentAttrs.publishedAt = scheduleDate.utc().add(12, 'hours').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      ugcNews.pickToSchedule();
      ugcNews.scheduleDate(scheduleDate.subtract(12, 'hours').format('x'));
      andThen(() => {
        ugcNews.scheduleTime(scheduleTime);
      });
    });

    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = 'twoMoons.jpg';
        Ember.run(()=>{
          ugcNews.fillInImage(file);
        });
      });
    });

   ugcNews.confirm();
  });
});