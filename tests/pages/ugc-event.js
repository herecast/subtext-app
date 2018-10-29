import { click, fillIn, triggerEvent } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import createImageFixture from 'subtext-ui/tests/helpers/create-image-fixture';
import {
  create,
  visitable,
  fillable,
  clickable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/events/new'),
  selectOrganization(organization) {
    return run(async () => {
      await click('[data-test-organization-dropdown]');
      await click(`[data-test-organization-select="${organization.id}"]`);
    });
  },
  fillInTitle: fillable('[data-test-field="event-title"]'),
  fillInDescription: fillable('[data-test-component="summer-note"]' + ' .note-editable'),
  expandReach: clickable('[data-test-input="expand-reach"]'),
  selectVenue(venue) {
    const venueSearch = '[data-test-field="venue-search"]';
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
  addDeadline(deadlineDate) {
    return run(async () => {
      await click('[data-test-deadline]');
      await fillIn('[data-test-input="event-deadline"]' + " input", deadlineDate);
    });
  },
  addPrice(price) {
    return run(async () => {
      await click('[data-test-paid-toggle]');
      await fillIn('[data-test-price-description]', price);
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
        await triggerEvent('[data-test-event-image]' + ' input[type=file]', 'change', [file] );
        resolve();
      });
    });
  },
  addContactEmail: fillable('[data-test-contact-email]'),
  addContactPhone: fillable('[data-test-contact-phone]'),
  addEventUrl: fillable('[data-test-event-url]'),
  next: clickable('[data-test-action="next"]'),
  saveAndPublish: clickable('[data-test-action="save-and-publish"]')
});
