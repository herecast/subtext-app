/* global FormData */
import { click } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import authenticateUser from 'subtext-app/tests/helpers/authenticate-user';
import ugcEvent from 'subtext-app/tests/pages/ugc-event';
import moment from 'moment';

module('Acceptance | ugc event', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Every field avaliable filled in', async function(assert) {
    const done = assert.async(3);
    const venue = this.server.create('venue');
    const organization = this.server.create('organization');
    const authorName = "Herbie Dunfie";
    const currentUser = this.server.create('current-user', {
      email: 'example@example.com',
      name: authorName,
      managedOrganizationIds: [parseInt(get(organization, 'id'))]
    });
    const repeat = 'daily';
    const price = '$7';
    const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
    const dateFormat = 'MM[/]DD[/]YYYY';
    const singleStartDate = moment().add(2, 'days').startOf('day');
    const recurringStartDate = moment().startOf('week').add(1, 'week').add(1, 'days').startOf('day');
    const recurringEndDate = recurringStartDate.add(8, 'weeks').startOf('day');
    const startTime = moment().add('2', 'days').startOf('day').utc().add(9, 'hours').format(timeFormat);
    const url = 'http://resistance.onion';
    const title = 'test-title';
    const description = 'test-description';
    const email = 'chewie@resistance.org';
    const phone = '6035555555'

    this.server.post('/contents', function(db) {
      const attrs = this.normalizedRequestAttrs();

      assert.deepEqual(
        attrs,
        {
          authorName: authorName,
          bizFeedPublic: true,
          contactEmail: email,
          contactPhone: phone,
          content: description,
          contentType: 'event',
          cost: price,
          eventUrl: null,
          url: url,
          listservIds: [],
          location: null,
          organizationId: get(organization, 'id'),
          publishedAt: null,
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
          title: title,
          venueId: parseInt(get(venue, 'id')),
          venueStatus: null
        },
        "Server received expected POST data."
      );
      done();

      const scheduleAttrs = attrs['schedules'];
      delete attrs['schedules'];
      const content = db.create('content', attrs);

      scheduleAttrs.forEach((data) => {
        data['content'] = content;
        db.create('schedule', data);
      });

      const startsAt = (new Date()).toISOString();
      const eventInstance = db.create('event-instance', { startsAt });

      content.update({
        eventInstanceId: eventInstance.id,
        eventInstanceIds: [eventInstance.id]
      });

      return content;
    });

    this.server.post(`/images`, function({images}, request) {
      if (request.requestBody.constructor === FormData) {
        done();
        assert.ok(true, 'Uploaded the image');
      }
      return images.create();
    });


    authenticateUser(this.server, currentUser);

    await ugcEvent.start();

    await ugcEvent.selectOrganization(organization);
    await ugcEvent.fillInTitle('test-title');

    await ugcEvent.fillInTitle(title)
      .fillInDescription(description)
      .fillInCost(price)
      .fillInEmail(email)
      .fillInPhone(phone)
      .fillInUrl(url);

    await ugcEvent.selectVenue(venue);
    await ugcEvent.addSingleDate({
      startDate: singleStartDate.format(dateFormat)
    });
    await ugcEvent.addRecurringDates({
      repeat: repeat,
      recurringStartDate: recurringStartDate.format(dateFormat),
      recurringEndDate: recurringEndDate.format(dateFormat)
    });


    await ugcEvent.addImageFile();
    await click('[data-test-jobs-action="add-another-image"]');
    await ugcEvent.addImageFile();

    await ugcEvent.preview();
    ugcEvent.launch();
  });
});
