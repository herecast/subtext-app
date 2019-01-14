import { click, fillIn, triggerEvent, visit } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import {
  create,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  start() {
    return run(async () => {
      await visit('/');
      await click('[data-test-button="open-job-tray"]');
      await click('[data-test-ugc-job-link]' + `[data-test-link="event"]`);
    });
  },
  selectOrganization(organization) {
    return run(async () => {
      await click('[data-test-jobs-field="owner"]');
      await click(`[data-test-organization-select="${organization.id}"]`);
    });
  },
  fillInTitle: fillable('[data-test-jobs-field="title"]'),
  fillInDescription: fillable('[data-test-jobs-field="content"]'),
  selectVenue(venue) {
    const venueSearch = '[data-test-jobs-field="venue-search"]';
    return run(async () => {
      await fillIn(venueSearch, venue.name);
      await triggerEvent(venueSearch, 'keyup');
      await click(`[data-test-venue-result="${venue.id}"]`);
    });
  },
  addSingleDate(options) {
    return run(async () => {
      await click('[data-test-event-form-add-single-date]');
      // Focusing causes today to be selected
      if (typeof options === 'undefined'){
        await triggerEvent('[data-test-component="start-date"]' + " input", 'focus');
      } else {
        await fillIn('[data-test-component="start-date"]' + " input", options.startDate);
      }

       await triggerEvent('[data-test-component="start-time"]' + " input", 'focus');

       await click('[data-test-save-event-date]');
     });
  },
  addRecurringDates(options) {
    return run(async () => {
       await click('[data-test-event-form-add-repeating-dates]');

       await fillIn('[data-test-recurring-component="start-date"]' + " input", options.recurringStartDate);
       await fillIn('[data-test-recurring-component="end-date"]' + " input", options.recurringEndDate);
       await fillIn('[data-test-recurring-component="repeat-type"]', options.repeat);
       await triggerEvent('[data-test-recurring-component="start-time"]' + " input", 'focus');

       await click('[data-test-complete-recurring-form]');
   });
  },

  addImageFile() {
    return new Promise((resolve) => {
      const options = {
        height: 200,
        width: 200,
        name: 'image.png',
        type: 'image/png'
      };
      createImageFixture(options)
      .then(async (file) => {
        await triggerEvent('[data-test-jobs-field="images"]' + ' input[type=file]', 'change', [file] );
        resolve();
      });
    });
  },
  fillInCost: fillable('[data-test-jobs-field="cost"]'),
  fillInEmail: fillable('[data-test-jobs-field="contact-email"]'),
  fillInUrl: fillable('[data-test-jobs-field="url"]'),
  fillInPhone: fillable('[data-test-jobs-field="contact-phone"]'),

  preview: clickable('[data-test-action="preview"]'),
  launch: clickable('[data-test-action="launch"]')
});
