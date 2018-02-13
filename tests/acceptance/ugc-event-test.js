/* global FormData */
import { test } from 'qunit';
import moduleForAcceptance from 'subtext-ui/tests/helpers/module-for-acceptance';
import authenticateUser from 'subtext-ui/tests/helpers/authenticate-user';
import ugcEvent from 'subtext-ui/tests/pages/ugc-event';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import Ember from 'ember';
import moment from 'moment';

const { get } = Ember;

moduleForAcceptance('Acceptance | ugc event');

test('Every field avaliable filled in **filter', function(assert) {
  const done = assert.async(2);
  const venue = server.create('venue');
  const location = server.create('location');
  const listserv = server.create('listserv');
  const organization = server.create('organization');
  const currentUser = server.create('current-user', { email: 'example@example.com' });
  currentUser.managedOrganizationIds = [parseInt(get(organization, 'id'))];

  const presenter = 'Vader';
  const subtitle = 'My life on Mustafar';
  const repeat = 'bi-weekly';
  const price = '$7';

  const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
  const dateFormat = 'MM[/]DD[/]YYYY';
  const singleStartDate = moment().add(2, 'days').startOf('day');
  const recurringStartDate = moment().add(1, 'days').startOf('day');
  const recurringEndDate = moment().add(8, 'days').startOf('day');
  const startTime = moment().add('2', 'days').startOf('day').utc().add(9, 'hours').format(timeFormat);
  const deadlineDate = moment().add('3', 'days').startOf('day');

  server.post('/events', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.equal(JSON.stringify(attrs), JSON.stringify({
      authorId: null,
      authorName: null,
      avatarUrl: null,
      contactEmail: 'chewie@resistance.org',
      contactPhone: '6035555555',
      content: 'test-description',
      contentType: null,
      contentOrigin: null,
      cost: price,
      costType: 'paid',
      embeddedAd: false,
      eventId: null,
      eventInstanceId: null,
      eventUrl: 'http://resistance.onion',
      hasContactInfo: false,
      imageWidth: null,
      imageHeight: null,
      listservIds: [parseInt(get(listserv, 'id'))],
      organizationId: get(organization, 'id'),
      organizationName: null,
      organizationProfileImageUrl: null,
      organizationBizFeedActive: false,
      parentContentId: null,
      parentContentType: null,
      parentEventInstanceId: null,
      registrationDeadline: deadlineDate,
      sold: false,
      title: 'test-title',
      updatedAt: null,
      ugcJob: null,
      viewCount: null,
      venueId: parseInt(get(venue, 'id')),
      venueStatus: 'new',
      wantsToAdvertise: true,
      promoteRadius: 50,
      category: null,
      ugcBaseLocationId: get(location, 'id'),
      schedules: [
        {
          subtitle: subtitle,
          starts_at: startTime,
          ends_at: null,
          presenter_name: presenter,
          repeats: 'once',
          days_of_week: [],
          overrides: [],
          weeks_of_month: [],
          _remove: false,
          end_date: singleStartDate.utc().format(timeFormat)
        },
        {
          subtitle: subtitle,
          starts_at: recurringStartDate.utc().add(9, 'hours').format(timeFormat),
          ends_at: null,
          presenter_name: presenter,
          repeats: repeat,
          days_of_week: [
            // +1 for different convention
            (parseInt(moment().format('d')) + 1)
          ],
          overrides: [],
          weeks_of_month: [],
          _remove: false,
          end_date: recurringEndDate.utc().format(timeFormat)
        }
      ]
    }),
      "Server received expected POST data."
    );
    done();
    const feedContent = server.create('feedContent');
    const eventInstance = server.create('eventInstance');
    return server.create('event', {firstInstanceId: eventInstance.id, contentId: feedContent.id});
  });

  server.put(`/events/:id`, function(_, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return {};
  });

  Ember.run(() => {
    authenticateUser(this.application, server, currentUser);

    ugcEvent.visit();
    ugcEvent.selectOrganization(organization);
    ugcEvent.fillInTitle('test-title');
    ugcEvent.selectVenue(venue);
    ugcEvent.addSingleDate({
      startDate: singleStartDate.format(dateFormat),
      subtitle: subtitle,
      presenter: presenter
    });
    ugcEvent.addRecurringDates({
      subtitle: subtitle,
      presenter: presenter,
      repeat: repeat,
      recurringStartDate: recurringStartDate.format(dateFormat),
      recurringEndDate: recurringEndDate.format(dateFormat)
    });
    ugcEvent.expandReach();
    ugcEvent.addDeadline(deadlineDate.format(dateFormat));
    ugcEvent.addPrice(price);
    andThen(()=>{
      return createImageFixture(200,200).then((file) => {
        file.name = 'vaderNoMask.jpg';
        Ember.run(()=>{
          ugcEvent.fillInImage(file);
        });
      });
    });
    ugcEvent.fillInDescription('test-description');
    ugcEvent.addContactEmail('chewie@resistance.org');
    ugcEvent.addContactPhone('6035555555');
    ugcEvent.addEventUrl('http://resistance.onion');
    ugcEvent.next();

    ugcEvent.selectLocation(location);
    ugcEvent.pickRadius(50);
    ugcEvent.pickListserv(listserv);
    ugcEvent.next();

    ugcEvent.saveAndPublish();
  });
});