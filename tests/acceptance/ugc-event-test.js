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

test('Every field avaliable filled in', function(assert) {
  const done = assert.async(2);
  const venue = server.create('venue');
  const location = server.create('location');
  const organization = server.create('organization');
  const currentUser = server.create('current-user', { email: 'example@example.com' });
  currentUser.managedOrganizationIds = [parseInt(get(organization, 'id'))];

  const repeat = 'daily';
  const price = '$7';

  const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
  const dateFormat = 'MM[/]DD[/]YYYY';
  const singleStartDate = moment().add(2, 'days').startOf('day');
  const recurringStartDate = moment().startOf('week').add(1, 'week').add(1, 'days').startOf('day');
  const recurringEndDate = recurringStartDate.add(8, 'weeks').startOf('day');
  const startTime = moment().add('2', 'days').startOf('day').utc().add(9, 'hours').format(timeFormat);
  const deadlineDate = moment().add('3', 'days').startOf('day');

  server.post('/contents', function() {
    const attrs = this.normalizedRequestAttrs();
    assert.deepEqual(
      attrs,
      {
        authorName: null,
        baseLocationName: null,
        bizFeedPublic: true,
        contactEmail: 'chewie@resistance.org',
        contactPhone: '6035555555',
        content: 'test-description',
        contentType: 'event',
        cost: price,
        costType: 'paid',
        eventUrl: 'http://resistance.onion',
        listservIds: [],
        organizationId: get(organization, 'id'),
        promoteRadius: 50,
        publishedAt: null,
        registrationDeadline: deadlineDate.utc().format(timeFormat),
        schedules: [
          {
            days_of_week: [],
            end_date: singleStartDate.utc().format(timeFormat),
            ends_at: null,
            overrides: [],
            _remove: false,
            repeats: 'once',
            starts_at: startTime,
            subtitle: null,
            weeks_of_month: [],
          },
          {
            days_of_week: [1,2,3,4,5,6,7],
            end_date: recurringEndDate.utc().format(timeFormat),
            ends_at: null,
            overrides: [],
            repeats: repeat,
            starts_at: recurringStartDate.utc().add(9, 'hours').format(timeFormat),
            subtitle: null,
            weeks_of_month: [],
            _remove: false,
          }
        ],
        sold: false,
        subtitle: null,
        sunsetDate: null,
        title: 'test-title',
        locationId: get(location, 'id'),
        venueId: parseInt(get(venue, 'id')),
        venueStatus: 'new',
        wantsToAdvertise: true
      },
      "Server received expected POST data."
    );
    done();
    const eventInstance = server.create('eventInstance');
    return server.create('content', {eventInstanceId: eventInstance.id});
  });

  server.post(`/images`, function({images}, request) {
    if(request.requestBody.constructor === FormData) {
      done();
      assert.ok(true, 'Uploaded the image');
    }
    return images.create();
  });

  Ember.run(() => {
    authenticateUser(this.application, server, currentUser);

    ugcEvent.visit();
    ugcEvent.selectOrganization(organization);
    ugcEvent.fillInTitle('test-title');
    ugcEvent.selectVenue(venue);
    ugcEvent.addSingleDate({
      startDate: singleStartDate.format(dateFormat)
    });
    ugcEvent.addRecurringDates({
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
    ugcEvent.next();

    ugcEvent.saveAndPublish();
  });
});
